"""Verify jaxtyping + beartype runtime shape checking is active."""
import pytest
import jax.numpy as jnp

from ddpm.schedule import q_sample, cosine_schedule


def test_q_sample_correct_shapes():
    """Should pass with correct shapes."""
    schedule = cosine_schedule(10)
    x0 = jnp.ones((2, 3, 8, 8))
    t = jnp.array([0, 5])
    noise = jnp.ones((2, 3, 8, 8))
    result = q_sample(x0, t, noise, schedule)
    assert result.shape == (2, 3, 8, 8)


def test_q_sample_wrong_t_shape_raises():
    """t should be 1D (batch,), not a scalar. Runtime check should catch this."""
    schedule = cosine_schedule(10)
    x0 = jnp.ones((2, 3, 8, 8))
    t = jnp.array(5)  # scalar, not (batch,)
    noise = jnp.ones((2, 3, 8, 8))
    with pytest.raises(Exception):
        q_sample(x0, t, noise, schedule)
