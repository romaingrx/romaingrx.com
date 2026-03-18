from collections.abc import Callable

import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
from jaxtyping import Array, Float, Int, PRNGKeyArray

from .config import CHARSET, IMG_CHANNELS, IMG_SIZE, N_VALIDATION_SAMPLES
from .model import UNet
from .schedule import NoiseSchedule
from .sdf import SDFNormalizer, sdf_to_b64
from .types import Image, ImageBatch


def _make_ddpm_sample_fn(
    model: UNet,
    schedule: NoiseSchedule,
    shape: tuple[int, int, int],
) -> Callable[..., Image]:
    T = schedule.T
    sqrt_recip_alphas = schedule.sqrt_recip_alphas
    betas = schedule.betas
    alpha_bars = schedule.alpha_bars
    posterior_variance = schedule.posterior_variance

    @eqx.filter_jit
    def _sample(
        key: PRNGKeyArray, label: Int[Array, ""] | None = None
    ) -> Image:
        key, init_key = jr.split(key)
        x0 = jr.normal(init_key, shape)
        keys = jr.split(key, T)

        def body(i: int, x: Float[Array, "c h w"]) -> Float[Array, "c h w"]:
            t = T - 1 - i
            t_arr = jnp.array(t)
            pred_noise = model(x, t_arr, label=label)

            beta = betas[t]
            alpha_bar = alpha_bars[t]
            coeff = beta / jnp.sqrt(1.0 - alpha_bar)
            mean = sqrt_recip_alphas[t] * (x - coeff * pred_noise)

            sigma = jnp.sqrt(posterior_variance[t])
            noise = jr.normal(keys[i], shape)
            x_new = mean + jnp.where(t > 0, sigma, 0.0) * noise
            return x_new

        result = jax.lax.fori_loop(0, T, body, x0)
        return jnp.clip(result, -1.0, 1.0)

    return _sample


def ddpm_sample_with_intermediates(
    model: UNet,
    schedule: NoiseSchedule,
    shape: tuple[int, int, int],
    *,
    label: Int[Array, ""] | None = None,
    key: PRNGKeyArray,
    capture_every: int = 100,
) -> tuple[Image, list[tuple[int, Image]]]:
    key, init_key = jr.split(key)
    x = jr.normal(init_key, shape)
    intermediates: list[tuple[int, Image]] = []

    for t_int in reversed(range(schedule.T)):
        t = jnp.array(t_int)
        pred_noise = model(x, t, label=label)

        beta = schedule.betas[t_int]
        alpha_bar = schedule.alpha_bars[t_int]
        mean = schedule.sqrt_recip_alphas[t_int] * (
            x - beta / jnp.sqrt(1.0 - alpha_bar) * pred_noise
        )

        if t_int > 0:
            key, noise_key = jr.split(key)
            noise = jr.normal(noise_key, shape)
            sigma = jnp.sqrt(schedule.posterior_variance[t_int])
            x = mean + sigma * noise
        else:
            x = mean

        if t_int % capture_every == 0 or t_int == schedule.T - 1:
            intermediates.append((t_int, x))

    x = jnp.clip(x, -1.0, 1.0)
    return x, intermediates


def sample_batch(
    model: UNet,
    schedule: NoiseSchedule,
    n: int,
    shape: tuple[int, int, int],
    *,
    key: PRNGKeyArray,
    labels: Int[Array, " n"] | None = None,
) -> ImageBatch:
    fn = _make_ddpm_sample_fn(model, schedule, shape)
    keys = jr.split(key, n)
    if labels is not None:
        return jax.vmap(fn)(keys, labels)
    return jax.vmap(fn)(keys)


def generate_validation_samples(
    ema_model: UNet,
    schedule: NoiseSchedule,
    normalizer: SDFNormalizer,
    *,
    key: PRNGKeyArray,
) -> list[str]:
    shape = (IMG_CHANNELS, IMG_SIZE, IMG_SIZE)
    # Sample one glyph per selected character spread across charset
    n = N_VALIDATION_SAMPLES
    step = max(1, len(CHARSET) // n)
    selected = [i * step for i in range(n)]
    labels = jnp.array(selected)
    batch = sample_batch(ema_model, schedule, n, shape, key=key, labels=labels)
    return [sdf_to_b64(batch[i], normalizer) for i in range(batch.shape[0])]
