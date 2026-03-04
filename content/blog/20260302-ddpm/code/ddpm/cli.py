import click
import jax.random as jr
import structlog

from .checkpoint import load_ema_model
from .collect import collect_and_save
from .config import (
    ATTN_RESOLUTIONS,
    BASE_CHANNELS,
    CACHE_DIR,
    CHANNEL_MULTS,
    TIMESTEPS,
)
from .data import load_pokemon
from .model import UNet
from .schedule import linear_schedule
from .train import train_loop
from .config import IMG_CHANNELS, IMG_SIZE

log = structlog.get_logger()


@click.group()
def main() -> None:
    pass


@main.command()
def train() -> None:
    key = jr.PRNGKey(42)

    data = load_pokemon(CACHE_DIR, augment=True)
    log.info("dataset_loaded", n_images=data.shape[0], shape=data.shape[1:])

    schedule = linear_schedule(TIMESTEPS)

    key, init_key, train_key, collect_key = jr.split(key, 4)
    model = UNet(
        img_channels=IMG_CHANNELS,
        base_channels=BASE_CHANNELS,
        channel_mults=CHANNEL_MULTS,
        attn_resolutions=ATTN_RESOLUTIONS,
        img_size=IMG_SIZE,
        key=init_key,
    )

    ema_model, training, training_samples = train_loop(
        model, data, schedule, key=train_key
    )

    collect_and_save(
        ema_model, schedule, data, training, training_samples, key=collect_key
    )


@main.command()
def resample() -> None:
    key = jr.PRNGKey(99)

    schedule = linear_schedule(TIMESTEPS)

    key, init_key = jr.split(key)
    model = UNet(
        img_channels=IMG_CHANNELS,
        base_channels=BASE_CHANNELS,
        channel_mults=CHANNEL_MULTS,
        attn_resolutions=ATTN_RESOLUTIONS,
        img_size=IMG_SIZE,
        key=init_key,
    )
    ema_model = load_ema_model(model)
    log.info("loaded_ema_model")

    data = load_pokemon(CACHE_DIR, augment=False)

    collect_and_save(ema_model, schedule, data, [], [], key=key)
