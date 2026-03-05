from dataclasses import dataclass
from functools import cached_property

import jax.numpy as jnp
from einops import rearrange
from jaxtyping import Array, Float, Int

from .types import ImageBatch


@dataclass(frozen=True)
class NoiseSchedule:
    betas: Float[Array, " T"]

    @cached_property
    def T(self) -> int:
        return int(self.betas.shape[0])

    @cached_property
    def alphas(self) -> Float[Array, " T"]:
        return 1.0 - self.betas

    @cached_property
    def alpha_bars(self) -> Float[Array, " T"]:
        return jnp.cumprod(self.alphas)

    @cached_property
    def sqrt_alpha_bars(self) -> Float[Array, " T"]:
        return jnp.sqrt(self.alpha_bars)

    @cached_property
    def sqrt_one_minus_alpha_bars(self) -> Float[Array, " T"]:
        return jnp.sqrt(1.0 - self.alpha_bars)

    @cached_property
    def sqrt_recip_alphas(self) -> Float[Array, " T"]:
        return 1.0 / jnp.sqrt(self.alphas)

    @cached_property
    def posterior_variance(self) -> Float[Array, " T"]:
        alpha_bars_prev = jnp.concatenate([jnp.ones(1), self.alpha_bars[:-1]])
        variance = self.betas * (1.0 - alpha_bars_prev) / (1.0 - self.alpha_bars)
        return variance.at[0].set(0.0)


def linear_schedule(
    T: int, beta_start: float = 1e-4, beta_end: float = 0.02
) -> NoiseSchedule:
    betas = jnp.linspace(beta_start, beta_end, T)
    return NoiseSchedule(betas)


def cosine_schedule(T: int, s: float = 0.008) -> NoiseSchedule:
    steps = jnp.arange(T + 1)
    f = jnp.cos((steps / T + s) / (1 + s) * jnp.pi / 2) ** 2
    alpha_bars = f / f[0]
    betas = 1.0 - alpha_bars[1:] / alpha_bars[:-1]
    betas = jnp.clip(betas, 0.0001, 0.02)
    return NoiseSchedule(betas)


def q_sample(
    x0: ImageBatch,
    t: Int[Array, " b"],
    noise: ImageBatch,
    schedule: NoiseSchedule,
) -> ImageBatch:
    sqrt_alpha_bar = rearrange(schedule.sqrt_alpha_bars[t], "b -> b 1 1 1")
    sqrt_one_minus_alpha_bar = rearrange(schedule.sqrt_one_minus_alpha_bars[t], "b -> b 1 1 1")
    return sqrt_alpha_bar * x0 + sqrt_one_minus_alpha_bar * noise
