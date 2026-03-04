import base64
import json
import os
import pickle

import equinox as eqx
import jax
import jax.numpy as jnp
import optax
import structlog

from .config import CHECKPOINT_DIR, N_VALIDATION_SAMPLES
from .data import array_to_b64
from .model import UNet
from .sample import sample_batch
from .schedule import NoiseSchedule
from .schema import EpochMetrics, TrainingSample
from .config import IMG_CHANNELS, IMG_SIZE

log = structlog.get_logger()


def save_checkpoint(
    epoch: int,
    model: UNet,
    ema_model: UNet,
    opt_state: optax.OptState,
    training: list[EpochMetrics],
    key: jax.Array,
    sample_pngs: list[str] | None = None,
) -> None:
    epoch_dir = CHECKPOINT_DIR / f"epoch_{epoch:04d}"
    epoch_dir.mkdir(parents=True, exist_ok=True)

    eqx.tree_serialise_leaves(str(epoch_dir / "model.eqx"), model)
    eqx.tree_serialise_leaves(str(epoch_dir / "ema_model.eqx"), ema_model)
    with open(epoch_dir / "opt_state.pkl", "wb") as f:
        pickle.dump(opt_state, f)
    with open(epoch_dir / "meta.json", "w") as f:
        json.dump(
            {
                "epoch": epoch,
                "training": [m.model_dump() for m in training],
                "key": key.tolist(),
            },
            f,
        )

    if sample_pngs:
        samples_dir = epoch_dir / "samples"
        samples_dir.mkdir(exist_ok=True)
        for i, b64_png in enumerate(sample_pngs):
            png_bytes = base64.b64decode(b64_png)
            (samples_dir / f"sample_{i}.png").write_bytes(png_bytes)

    latest = CHECKPOINT_DIR / "latest"
    if latest.is_symlink() or latest.exists():
        latest.unlink()
    os.symlink(epoch_dir.name, str(latest))

    log.info("checkpoint_saved", epoch=epoch, path=str(epoch_dir))


def load_checkpoint(
    model: UNet,
    ema_model: UNet,
) -> tuple[int, UNet, UNet, optax.OptState, list[EpochMetrics], jax.Array] | None:
    latest = CHECKPOINT_DIR / "latest"
    if not latest.exists():
        return None

    epoch_dir = CHECKPOINT_DIR / os.readlink(str(latest))

    meta_path = epoch_dir / "meta.json"
    if not meta_path.exists():
        return None

    model = eqx.tree_deserialise_leaves(str(epoch_dir / "model.eqx"), model)
    ema_model = eqx.tree_deserialise_leaves(str(epoch_dir / "ema_model.eqx"), ema_model)
    with open(epoch_dir / "opt_state.pkl", "rb") as f:
        opt_state = pickle.load(f)  # noqa: S301
    with open(meta_path) as f:
        meta = json.load(f)

    training = [EpochMetrics(**m) for m in meta["training"]]
    key = jnp.array(meta["key"], dtype=jnp.uint32)
    epoch = meta["epoch"]

    log.info("checkpoint_loaded", epoch=epoch, path=str(epoch_dir))
    return epoch, model, ema_model, opt_state, training, key


def load_ema_model(model: UNet) -> UNet:
    ema_path = CHECKPOINT_DIR / "latest" / "ema_model.eqx"
    if not ema_path.exists():
        raise FileNotFoundError(f"No checkpoint found at {ema_path}")
    return eqx.tree_deserialise_leaves(str(ema_path), model)


def generate_validation_samples(
    ema_model: UNet,
    schedule: NoiseSchedule,
    *,
    key: jax.Array,
) -> list[str]:
    shape = (IMG_CHANNELS, IMG_SIZE, IMG_SIZE)
    batch = sample_batch(ema_model, schedule, N_VALIDATION_SAMPLES, shape, key=key)
    return [array_to_b64(batch[i]) for i in range(batch.shape[0])]


def load_training_samples() -> list[TrainingSample]:
    samples: list[TrainingSample] = []
    if not CHECKPOINT_DIR.exists():
        return samples

    for epoch_dir in sorted(CHECKPOINT_DIR.glob("epoch_*")):
        samples_dir = epoch_dir / "samples"
        if not samples_dir.exists():
            continue
        epoch = int(epoch_dir.name.split("_")[1])
        images: list[str] = []
        for png_path in sorted(samples_dir.glob("sample_*.png")):
            b64 = base64.b64encode(png_path.read_bytes()).decode()
            images.append(b64)
        if images:
            samples.append(TrainingSample(epoch=epoch, images=images))

    return samples
