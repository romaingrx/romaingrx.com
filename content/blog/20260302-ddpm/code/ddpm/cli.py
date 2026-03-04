import click
import jax.random as jr
import structlog

from .checkpoint import load_ema_model
from .collect import collect_and_save
from .config import CACHE_DIR, TIMESTEPS, init_model
from .data import load_pokemon
from .schedule import linear_schedule
from .train import train_loop

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

    key, init_key = jr.split(key)
    model = init_model(key=init_key)

    ema_model, training, training_samples = train_loop(model, data, schedule, key=key)

    collect_and_save(ema_model, schedule, data, training, training_samples, key=key)


@main.command()
def resample() -> None:
    key = jr.PRNGKey(99)

    schedule = linear_schedule(TIMESTEPS)

    key, init_key = jr.split(key)
    ema_model = load_ema_model(key=init_key)
    log.info("loaded_ema_model")

    data = load_pokemon(CACHE_DIR, augment=False)

    collect_and_save(ema_model, schedule, data, [], [], key=key)
