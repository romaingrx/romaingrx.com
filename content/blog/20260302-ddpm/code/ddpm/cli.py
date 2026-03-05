import logging

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
    DROPOUT_RATE,
    IMG_CHANNELS,
    IMG_SIZE,
    TIMESTEPS,
)
from .data import load_pokemon
from .model import UNet
from .schedule import cosine_schedule
from .train import train_loop

log = structlog.get_logger()


@click.group()
@click.option(
    "-v",
    "--verbose",
    is_flag=True,
    help="Enable debug logging (incl. JAX compile logs)",
)
def main(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.dev.ConsoleRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(level),
        logger_factory=structlog.PrintLoggerFactory(),
    )

    handler = logging.StreamHandler()
    handler.setFormatter(
        structlog.stdlib.ProcessorFormatter(
            processors=[
                structlog.stdlib.add_log_level,
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.dev.ConsoleRenderer(),
            ],
        )
    )
    logging.basicConfig(handlers=[handler], level=level, force=True)


@main.command()
def train() -> None:
    key = jr.PRNGKey(42)

    data = load_pokemon(CACHE_DIR, augment=True)
    log.info("dataset_loaded", n_images=data.shape[0], shape=data.shape[1:])

    schedule = cosine_schedule(TIMESTEPS)

    key, init_key, train_key, collect_key = jr.split(key, 4)
    model = UNet(
        img_channels=IMG_CHANNELS,
        base_channels=BASE_CHANNELS,
        channel_mults=CHANNEL_MULTS,
        attn_resolutions=ATTN_RESOLUTIONS,
        img_size=IMG_SIZE,
        dropout_rate=DROPOUT_RATE,
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

    schedule = cosine_schedule(TIMESTEPS)

    key, init_key = jr.split(key)
    model = UNet(
        img_channels=IMG_CHANNELS,
        base_channels=BASE_CHANNELS,
        channel_mults=CHANNEL_MULTS,
        attn_resolutions=ATTN_RESOLUTIONS,
        img_size=IMG_SIZE,
        dropout_rate=DROPOUT_RATE,
        key=init_key,
    )
    ema_model = load_ema_model(model)
    log.info("loaded_ema_model")

    data = load_pokemon(CACHE_DIR, augment=False)

    collect_and_save(ema_model, schedule, data, [], [], key=key)
