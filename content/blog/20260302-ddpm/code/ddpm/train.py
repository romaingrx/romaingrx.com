import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
import optax
import structlog
from jaxtyping import Array, Float, Int, PRNGKeyArray, UInt32

from .checkpoint import load_checkpoint, save_checkpoint
from .collect import load_training_samples
from .config import BATCH_SIZE, CHECKPOINT_EVERY, COMPUTE_DTYPE, EMA_DECAY, EPOCHS, LR
from .model import UNet
from .sample import generate_validation_samples
from .schedule import NoiseSchedule, q_sample
from .schema import EpochMetrics, TrainingSample
from .sdf import SDFNormalizer
from .types import ImageBatch, LabelBatch, Scalar

log = structlog.get_logger()


def _make_train_epoch(
    opt: optax.GradientTransformation,
    schedule: NoiseSchedule,
    ema_decay: float,
):
    """Build a JIT-compiled epoch function. Statics captured in closure."""
    dtype = jnp.dtype(COMPUTE_DTYPE)

    def loss_fn(
        model: UNet, batch: ImageBatch, labels: LabelBatch, *, key: PRNGKeyArray
    ) -> Scalar:
        b = batch.shape[0]
        k1, k2, k3 = jr.split(key, 3)
        t = jr.randint(k1, (b,), 0, schedule.T)
        noise = jr.normal(k2, batch.shape, dtype=dtype)
        x_noisy = q_sample(batch.astype(dtype), t, noise, schedule)
        pred = jax.vmap(model)(x_noisy, t, label=labels, key=jr.split(k3, b))
        return jnp.mean((pred - noise) ** 2).astype(jnp.float32)

    @eqx.filter_jit
    def train_epoch(
        model: UNet,
        ema_model: UNet,
        opt_state: optax.OptState,
        batches: Float[Array, "n_batches batch c h w"],
        label_batches: Int[Array, "n_batches batch"],
        keys: UInt32[Array, "n 2"],
    ) -> tuple[UNet, UNet, optax.OptState, Scalar]:
        model_dyn, model_static = eqx.partition(model, eqx.is_array)
        ema_dyn = eqx.filter(ema_model, eqx.is_array)
        opt_dyn, opt_static = eqx.partition(opt_state, eqx.is_array)

        def step(carry, inputs):  # type: ignore[no-untyped-def]
            m, e, o = carry
            batch, labels, key = inputs

            model = eqx.combine(m, model_static)
            opt_state = eqx.combine(o, opt_static)

            loss, grads = eqx.filter_value_and_grad(loss_fn)(
                model, batch, labels, key=key
            )
            updates, opt_state = opt.update(
                grads, opt_state, eqx.filter(model, eqx.is_array)
            )  # type: ignore[reportArgumentType]
            model = eqx.apply_updates(model, updates)

            new_ema = optax.incremental_update(
                eqx.filter(model, eqx.is_array), e, step_size=1 - ema_decay
            )

            return (
                eqx.filter(model, eqx.is_array),
                new_ema,
                eqx.filter(opt_state, eqx.is_array),
            ), loss

        (model_dyn, ema_dyn, opt_dyn), losses = jax.lax.scan(
            step, (model_dyn, ema_dyn, opt_dyn), (batches, label_batches, keys)
        )
        return (
            eqx.combine(model_dyn, model_static),
            eqx.combine(ema_dyn, model_static),
            eqx.combine(opt_dyn, opt_static),
            jnp.mean(losses),
        )

    return train_epoch


def train_loop(
    model: UNet,
    data: Float[Array, "n c h w"],
    labels: Int[Array, " n"],
    schedule: NoiseSchedule,
    normalizer: SDFNormalizer,
    *,
    key: PRNGKeyArray,
) -> tuple[UNet, list[EpochMetrics], list[TrainingSample]]:
    n = data.shape[0]
    opt = optax.adam(LR)
    opt_state = opt.init(eqx.filter(model, eqx.is_array))
    epoch_fn = _make_train_epoch(opt, schedule, EMA_DECAY)

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
        idx = perm[: n_batches * BATCH_SIZE]
        batches = data[idx].reshape(n_batches, BATCH_SIZE, *data.shape[1:])
        label_batches = labels[idx].reshape(n_batches, BATCH_SIZE)

        model, ema_model, opt_state, loss = epoch_fn(
            model, ema_model, opt_state, batches, label_batches,
            jr.split(batch_key, n_batches),
        )

        loss_val = round(float(loss), 6)
        training.append(EpochMetrics(epoch=epoch, loss=loss_val, mse=loss_val))

        if epoch % 50 == 0 or epoch == EPOCHS - 1:
            log.info("epoch", loss=round(float(loss), 4), epoch=epoch)

        if (epoch + 1) % CHECKPOINT_EVERY == 0:
            key, val_key = jr.split(key)
            log.info("generating_validation_samples", epoch=epoch)
            sample_pngs = generate_validation_samples(
                ema_model, schedule, normalizer, key=val_key
            )
            training_samples.append(TrainingSample(epoch=epoch, images=sample_pngs))
            save_checkpoint(
                epoch, model, ema_model, opt_state, training, key, sample_pngs,
                normalizer=normalizer,
            )

    if EPOCHS % CHECKPOINT_EVERY != 0:
        key, val_key = jr.split(key)
        log.info("generating_final_validation_samples")
        sample_pngs = generate_validation_samples(
            ema_model, schedule, normalizer, key=val_key
        )
        training_samples.append(TrainingSample(epoch=EPOCHS - 1, images=sample_pngs))
        save_checkpoint(
            EPOCHS - 1, model, ema_model, opt_state, training, key, sample_pngs,
            normalizer=normalizer,
        )

    return ema_model, training, training_samples
