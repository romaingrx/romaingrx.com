from typing import Callable

import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
import optax
import structlog
from jaxtyping import Array, Float, PRNGKeyArray

from .checkpoint import load_checkpoint, save_checkpoint
from .collect import load_training_samples
from .sample import generate_validation_samples
from .config import BATCH_SIZE, CHECKPOINT_EVERY, COMPUTE_DTYPE, EMA_DECAY, EPOCHS, LR
from .model import UNet
from .schedule import NoiseSchedule, q_sample
from .schema import EpochMetrics, TrainingSample
from .types import ImageBatch, Scalar

log = structlog.get_logger()


def train_loop(
    model: UNet,
    data: Float[Array, "n c h w"],
    schedule: NoiseSchedule,
    *,
    key: PRNGKeyArray,
) -> tuple[UNet, list[EpochMetrics], list[TrainingSample]]:
    n = data.shape[0]
    opt = optax.adam(LR)
    opt_state = opt.init(eqx.filter(model, eqx.is_array))
    epoch_fn = _make_epoch_fn(opt, schedule, EMA_DECAY)

    ema_model = model
    start_epoch = 0
    training: list[EpochMetrics] = []
    training_samples: list[TrainingSample] = []
    checkpoint = load_checkpoint(model, ema_model)
    if checkpoint is not None:
        start_epoch, model, ema_model, opt_state, training, key = checkpoint
        start_epoch += 1
        training_samples = load_training_samples()

    n_batches = n // BATCH_SIZE

    for epoch in range(start_epoch, EPOCHS):
        key, epoch_key, batch_key = jr.split(key, 3)
        perm = jr.permutation(epoch_key, n)
        batches = data[perm[: n_batches * BATCH_SIZE]].reshape(
            n_batches, BATCH_SIZE, *data.shape[1:]
        )
        batch_keys = jr.split(batch_key, n_batches)

        model, ema_model, opt_state, avg_metrics = epoch_fn(
            model, ema_model, opt_state, batches, batch_keys
        )

        training.append(
            EpochMetrics(
                epoch=epoch,
                loss=round(float(avg_metrics["loss"]), 6),
                mse=round(float(avg_metrics["mse"]), 6),
            )
        )

        if epoch % 50 == 0 or epoch == EPOCHS - 1:
            log.info(
                "epoch",
                loss=round(float(avg_metrics["loss"]), 4),
                mse=round(float(avg_metrics["mse"]), 4),
                epoch=epoch,
            )

        if (epoch + 1) % CHECKPOINT_EVERY == 0:
            key, val_key = jr.split(key)
            log.info("generating_validation_samples", epoch=epoch)
            sample_pngs = generate_validation_samples(ema_model, schedule, key=val_key)
            training_samples.append(TrainingSample(epoch=epoch, images=sample_pngs))
            save_checkpoint(
                epoch, model, ema_model, opt_state, training, key, sample_pngs
            )

    if EPOCHS % CHECKPOINT_EVERY != 0:
        key, val_key = jr.split(key)
        log.info("generating_final_validation_samples")
        sample_pngs = generate_validation_samples(ema_model, schedule, key=val_key)
        training_samples.append(TrainingSample(epoch=EPOCHS - 1, images=sample_pngs))
        save_checkpoint(
            EPOCHS - 1, model, ema_model, opt_state, training, key, sample_pngs
        )

    return ema_model, training, training_samples


def _loss_fn(
    model: UNet,
    x0: ImageBatch,
    *,
    key: PRNGKeyArray,
    schedule: NoiseSchedule,
) -> tuple[Scalar, dict[str, Scalar]]:
    batch_size = x0.shape[0]
    k1, k2, k3 = jr.split(key, 3)

    dtype = jnp.dtype(COMPUTE_DTYPE)
    t = jr.randint(k1, (batch_size,), 0, schedule.T)
    noise = jr.normal(k2, x0.shape, dtype=dtype)
    x_noisy = q_sample(x0.astype(dtype), t, noise, schedule)
    dropout_keys = jr.split(k3, batch_size)
    pred_noise = jax.vmap(model)(x_noisy, t, key=dropout_keys)
    mse = jnp.mean((pred_noise - noise) ** 2).astype(jnp.float32)
    return mse, {"mse": mse}


def _ema_update(ema_model: UNet, model: UNet, decay: float) -> UNet:
    ema_arrays = eqx.filter(ema_model, eqx.is_array)
    model_arrays = eqx.filter(model, eqx.is_array)
    new_ema = optax.incremental_update(model_arrays, ema_arrays, step_size=1 - decay)
    return eqx.combine(new_ema, ema_model)


EpochFn = Callable[
    [UNet, UNet, optax.OptState, ImageBatch, PRNGKeyArray],
    tuple[UNet, UNet, optax.OptState, dict[str, Scalar]],
]


def _make_epoch_fn(
    opt: optax.GradientTransformation, schedule: NoiseSchedule, ema_decay: float
) -> EpochFn:
    # Static parts of model/ema/opt captured in closure; only arrays in scan carry.
    model_static: UNet = None  # type: ignore[assignment]
    opt_static: optax.OptState = None  # type: ignore[assignment]

    def _step(
        model_dyn: UNet,
        ema_dyn: UNet,
        opt_dyn: optax.OptState,
        batch: ImageBatch,
        key: PRNGKeyArray,
    ) -> tuple[UNet, UNet, optax.OptState, dict[str, Scalar]]:
        model = eqx.combine(model_dyn, model_static)
        ema_model = eqx.combine(ema_dyn, model_static)
        opt_state = eqx.combine(opt_dyn, opt_static)

        (loss, metrics), grads = eqx.filter_value_and_grad(_loss_fn, has_aux=True)(
            model, batch, key=key, schedule=schedule
        )
        updates, opt_state = opt.update(
            grads, opt_state, eqx.filter(model, eqx.is_array)
        )  # type: ignore[reportArgumentType]
        model = eqx.apply_updates(model, updates)
        ema_model = _ema_update(ema_model, model, ema_decay)

        model_dyn = eqx.filter(model, eqx.is_array)
        ema_dyn = eqx.filter(ema_model, eqx.is_array)
        opt_dyn = eqx.filter(opt_state, eqx.is_array)
        return model_dyn, ema_dyn, opt_dyn, {**metrics, "loss": loss}

    @eqx.filter_jit
    def train_epoch(
        model: UNet,
        ema_model: UNet,
        opt_state: optax.OptState,
        batches: Float[Array, "n_batches batch c h w"],
        keys: PRNGKeyArray,
    ) -> tuple[UNet, UNet, optax.OptState, dict[str, Scalar]]:
        nonlocal model_static, opt_static
        model_dyn, model_static = eqx.partition(model, eqx.is_array)
        ema_dyn = eqx.filter(ema_model, eqx.is_array)
        opt_dyn, opt_static = eqx.partition(opt_state, eqx.is_array)

        def scan_body(carry, inputs):  # type: ignore[no-untyped-def]
            model_dyn, ema_dyn, opt_dyn = carry
            batch, key = inputs
            model_dyn, ema_dyn, opt_dyn, metrics = _step(
                model_dyn, ema_dyn, opt_dyn, batch, key
            )
            return (model_dyn, ema_dyn, opt_dyn), metrics

        (model_dyn, ema_dyn, opt_dyn), all_metrics = jax.lax.scan(
            scan_body, (model_dyn, ema_dyn, opt_dyn), (batches, keys)
        )
        avg_metrics = jax.tree.map(lambda x: x.mean(), all_metrics)
        model = eqx.combine(model_dyn, model_static)
        ema_model = eqx.combine(ema_dyn, model_static)
        opt_state = eqx.combine(opt_dyn, opt_static)
        return model, ema_model, opt_state, avg_metrics

    return train_epoch
