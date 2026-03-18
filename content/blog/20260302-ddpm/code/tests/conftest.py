import jax
import pytest


@pytest.fixture(autouse=True)
def _disable_jit():
    """Disable JIT so jaxtyping+beartype sees real arrays, not tracers."""
    with jax.disable_jit():
        yield
