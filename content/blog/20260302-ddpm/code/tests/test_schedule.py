import jax.numpy as jnp

from ddpm.schedule import cosine_schedule


def test_cosine_schedule_shape():
    schedule = cosine_schedule(1000)
    assert schedule.T == 1000
    assert schedule.betas.shape == (1000,)


def test_alpha_bars_monotonically_decrease():
    schedule = cosine_schedule(1000)
    diffs = jnp.diff(schedule.alpha_bars)
    assert jnp.all(diffs < 0)


def test_alpha_bars_bounds():
    schedule = cosine_schedule(1000)
    assert float(schedule.alpha_bars[0]) < 1.0
    assert float(schedule.alpha_bars[-1]) > 0.0


def test_posterior_variance_zero_at_t0():
    schedule = cosine_schedule(1000)
    assert float(schedule.posterior_variance[0]) == 0.0


def test_cached_properties_consistent():
    schedule = cosine_schedule(100)
    assert jnp.allclose(schedule.alphas, 1.0 - schedule.betas)
    assert jnp.allclose(schedule.alpha_bars, jnp.cumprod(schedule.alphas))
    assert jnp.allclose(schedule.sqrt_alpha_bars, jnp.sqrt(schedule.alpha_bars))
