"""Verify jaxtyping + beartype runtime shape checking is active."""
import jax.numpy as jnp
import pytest
from jaxtyping import TypeCheckError

from ddpm.schedule import cosine_schedule, q_sample


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
    with pytest.raises(TypeCheckError, match=r"'t': weak_i32\[\]"):
        q_sample(x0, t, noise, schedule)
