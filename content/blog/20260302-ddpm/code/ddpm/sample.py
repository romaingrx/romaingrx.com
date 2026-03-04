import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
from jaxtyping import Array, Float, PRNGKeyArray

from .model import UNet
from .schedule import NoiseSchedule
from .types import Image, ImageBatch


def _make_ddpm_sample_fn(
    model: UNet,
    schedule: NoiseSchedule,
    shape: tuple[int, int, int],
):
    T = schedule.T
    sqrt_recip_alphas = schedule.sqrt_recip_alphas
    betas = schedule.betas
    alpha_bars = schedule.alpha_bars
    posterior_variance = schedule.posterior_variance

    @eqx.filter_jit
    def _sample(key: PRNGKeyArray) -> Image:
        key, init_key = jr.split(key)
        x0 = jr.normal(init_key, shape)
        keys = jr.split(key, T)

        def body(i: int, x: Float[Array, "c h w"]) -> Float[Array, "c h w"]:
            t = T - 1 - i
            t_arr = jnp.array(t)
            pred_noise = model(x, t_arr)

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
    key: PRNGKeyArray,
    capture_every: int = 100,
) -> tuple[Image, list[tuple[int, Image]]]:
    key, init_key = jr.split(key)
    x = jr.normal(init_key, shape)
    intermediates: list[tuple[int, Image]] = []

    for t_int in reversed(range(schedule.T)):
        t = jnp.array(t_int)
        pred_noise = model(x, t)

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
            x = jnp.clip(mean, -1.0, 1.0)

        if t_int % capture_every == 0 or t_int == schedule.T - 1:
            intermediates.append((t_int, x))

    return x, intermediates


def sample_batch(
    model: UNet,
    schedule: NoiseSchedule,
    n: int,
    shape: tuple[int, int, int],
    *,
    key: PRNGKeyArray,
) -> ImageBatch:
    fn = _make_ddpm_sample_fn(model, schedule, shape)
    keys = jr.split(key, n)
    return jax.vmap(fn)(keys)
