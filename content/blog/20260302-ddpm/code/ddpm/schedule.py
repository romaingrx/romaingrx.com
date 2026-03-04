import jax.numpy as jnp
from jaxtyping import Array, Float, Int

from .types import ImageBatch


class NoiseSchedule:
    betas: Float[Array, " T"]
    alphas: Float[Array, " T"]
    alpha_bars: Float[Array, " T"]
    sqrt_alpha_bars: Float[Array, " T"]
    sqrt_one_minus_alpha_bars: Float[Array, " T"]
    sqrt_recip_alphas: Float[Array, " T"]
    posterior_variance: Float[Array, " T"]

    def __init__(self, betas: Float[Array, " T"]) -> None:
        self.betas = betas
        self.alphas = 1.0 - betas
        self.alpha_bars = jnp.cumprod(self.alphas)
        self.sqrt_alpha_bars = jnp.sqrt(self.alpha_bars)
        self.sqrt_one_minus_alpha_bars = jnp.sqrt(1.0 - self.alpha_bars)
        self.sqrt_recip_alphas = 1.0 / jnp.sqrt(self.alphas)
        posterior_variance = (
            betas
            * (1.0 - jnp.concatenate([jnp.ones(1), self.alpha_bars[:-1]]))
            / (1.0 - self.alpha_bars)
        )
        self.posterior_variance = posterior_variance.at[0].set(0.0)

    @property
    def T(self) -> int:
        return int(self.betas.shape[0])


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
    sqrt_alpha_bar = schedule.sqrt_alpha_bars[t][:, None, None, None]
    sqrt_one_minus_alpha_bar = schedule.sqrt_one_minus_alpha_bars[t][
        :, None, None, None
    ]
    return sqrt_alpha_bar * x0 + sqrt_one_minus_alpha_bar * noise
