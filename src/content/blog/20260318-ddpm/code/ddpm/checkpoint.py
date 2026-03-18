import base64
import json
import os
import pickle

import equinox as eqx
import jax.numpy as jnp
import optax
import structlog
from jaxtyping import PRNGKeyArray

from .config import CHECKPOINT_DIR
from .model import UNet
from .schema import EpochMetrics
from .sdf import SDFNormalizer

log = structlog.get_logger()


def save_checkpoint(
    epoch: int,
    model: UNet,
    ema_model: UNet,
    opt_state: optax.OptState,
    training: list[EpochMetrics],
    key: PRNGKeyArray,
    sample_pngs: list[str] | None = None,
    normalizer: SDFNormalizer | None = None,
) -> None:
    epoch_dir = CHECKPOINT_DIR / f"epoch_{epoch:04d}"
    epoch_dir.mkdir(parents=True, exist_ok=True)

    eqx.tree_serialise_leaves(str(epoch_dir / "model.eqx"), model)
    eqx.tree_serialise_leaves(str(epoch_dir / "ema_model.eqx"), ema_model)
    with open(epoch_dir / "opt_state.pkl", "wb") as f:
        pickle.dump(opt_state, f)
    meta: dict = {
        "epoch": epoch,
        "training": [m.model_dump() for m in training],
        "key": key.tolist(),
    }
    if normalizer is not None:
        meta["sdf_normalizer"] = normalizer.to_dict()
    with open(epoch_dir / "meta.json", "w") as f:
        json.dump(meta, f)

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
) -> tuple[int, UNet, UNet, optax.OptState, list[EpochMetrics], PRNGKeyArray] | None:
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
