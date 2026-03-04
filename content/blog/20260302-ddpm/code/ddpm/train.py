from typing import Callable

import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
import optax
import structlog
from jaxtyping import Float, PRNGKeyArray

from .checkpoint import (
    generate_validation_samples,
    load_checkpoint,
    load_training_samples,
    save_checkpoint,
)
from .config import BATCH_SIZE, CHECKPOINT_EVERY, EMA_DECAY, EPOCHS, LR
from .model import UNet
from .schedule import NoiseSchedule, q_sample
from .schema import EpochMetrics, TrainingSample
from .types import ImageBatch, Scalar

log = structlog.get_logger()


def train_loop(
    model: UNet,
    data: Float[jax.Array, "n c h w"],
    schedule: NoiseSchedule,
    *,
    key: jax.Array,
) -> tuple[UNet, list[EpochMetrics], list[TrainingSample]]:
    n = data.shape[0]
    opt = optax.adam(LR)
    opt_state = opt.init(eqx.filter(model, eqx.is_array))
    step_fn = make_step_fn(opt, schedule, EMA_DECAY)

    ema_model = model
    start_epoch = 0
    training: list[EpochMetrics] = []
    training_samples: list[TrainingSample] = []
    checkpoint = load_checkpoint(model, ema_model)
    if checkpoint is not None:
        start_epoch, model, ema_model, opt_state, training, key = checkpoint
        start_epoch += 1
        training_samples = load_training_samples()

    for epoch in range(start_epoch, EPOCHS):
        key, epoch_key = jr.split(key)
        perm = jr.permutation(epoch_key, n)

        epoch_metrics: dict[str, float] = {"loss": 0.0, "mse": 0.0}
        n_batches = 0

        for i in range(0, n - BATCH_SIZE + 1, BATCH_SIZE):
            batch = data[perm[i : i + BATCH_SIZE]]
            key, step_key = jr.split(key)
            model, ema_model, opt_state, metrics = step_fn(
                model, ema_model, opt_state, batch, step_key
            )
            for k, v in metrics.items():
                epoch_metrics[k] += float(v)
            n_batches += 1

        avg = {k: v / n_batches for k, v in epoch_metrics.items()}
        training.append(
            EpochMetrics(
                epoch=epoch,
                loss=round(avg["loss"], 6),
                mse=round(avg["mse"], 6),
            )
        )

        if epoch % 50 == 0 or epoch == EPOCHS - 1:
            log.info("epoch", **{k: round(v, 4) for k, v in avg.items()}, epoch=epoch)

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


def loss_fn(
    model: UNet,
    x0: ImageBatch,
    *,
    key: PRNGKeyArray,
    schedule: NoiseSchedule,
) -> tuple[Scalar, dict[str, Scalar]]:
    batch_size = x0.shape[0]
    k1, k2 = jr.split(key)

    t = jr.randint(k1, (batch_size,), 0, schedule.T)
    noise = jr.normal(k2, x0.shape)
    x_noisy = q_sample(x0, t, noise, schedule)
    pred_noise = jax.vmap(model)(x_noisy, t)
    mse = jnp.mean((pred_noise - noise) ** 2)
    return mse, {"mse": mse}


def _ema_update(ema_model: UNet, model: UNet, decay: float) -> UNet:
    ema_arrays = eqx.filter(ema_model, eqx.is_array)
    model_arrays = eqx.filter(model, eqx.is_array)
    new_ema = jax.tree.map(
        lambda e, m: decay * e + (1 - decay) * m,
        ema_arrays,
        model_arrays,
    )
    return eqx.combine(new_ema, ema_model)


StepFn = Callable[
    [UNet, UNet, optax.OptState, ImageBatch, PRNGKeyArray],
    tuple[UNet, UNet, optax.OptState, dict[str, Scalar]],
]


def make_step_fn(
    opt: optax.GradientTransformation, schedule: NoiseSchedule, ema_decay: float
) -> StepFn:
    @eqx.filter_jit
    def step(
        model: UNet,
        ema_model: UNet,
        opt_state: optax.OptState,
        batch: ImageBatch,
        key: PRNGKeyArray,
    ) -> tuple[UNet, UNet, optax.OptState, dict[str, Scalar]]:
        (loss, metrics), grads = eqx.filter_value_and_grad(loss_fn, has_aux=True)(
            model, batch, key=key, schedule=schedule
        )
        updates, opt_state = opt.update(
            grads, opt_state, eqx.filter(model, eqx.is_array)
        )  # type: ignore[reportArgumentType]
        model = eqx.apply_updates(model, updates)
        ema_model = _ema_update(ema_model, model, ema_decay)
        return model, ema_model, opt_state, {**metrics, "loss": loss}

    return step
