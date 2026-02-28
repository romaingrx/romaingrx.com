from typing import Callable

import equinox as eqx
import jax
import jax.numpy as jnp
import optax
from jaxtyping import Array, Float, PRNGKeyArray

from .model import VAE
from .types import Scalar


def loss_fn(
    model: VAE,
    x: Float[Array, "batch seq vocab"],
    *,
    key: PRNGKeyArray,
    beta: Float[Array, ""],
) -> tuple[Scalar, dict[str, Scalar]]:
    batch_size = x.shape[0]
    keys = jax.random.split(key, batch_size)

    def single(xi: Float[Array, "seq vocab"], ki: PRNGKeyArray) -> tuple[Scalar, Scalar]:
        logits, mu, logvar = model(xi, key=ki)
        recon = -jnp.sum(xi * jax.nn.log_softmax(logits))
        kl = -0.5 * jnp.sum(1.0 + logvar - mu**2 - jnp.exp(logvar))
        return recon, kl

    recon, kl = jax.vmap(single)(x, keys)
    recon, kl = jnp.mean(recon), jnp.mean(kl)
    loss = recon + beta * kl
    return loss, {"recon": recon, "kl": kl}


StepFn = Callable[
    [VAE, optax.OptState, Float[Array, "batch seq vocab"], PRNGKeyArray, Float[Array, ""]],
    tuple[VAE, optax.OptState, dict[str, Scalar]],
]


def make_step_fn(opt: optax.GradientTransformation) -> StepFn:
    @eqx.filter_jit
    def step(
        model: VAE,
        opt_state: optax.OptState,
        batch: Float[Array, "batch seq vocab"],
        key: PRNGKeyArray,
        beta: Float[Array, ""],
    ) -> tuple[VAE, optax.OptState, dict[str, Scalar]]:
        (loss, metrics), grads = eqx.filter_value_and_grad(loss_fn, has_aux=True)(
            model, batch, key=key, beta=beta
        )
        updates, opt_state = opt.update(grads, opt_state, eqx.filter(model, eqx.is_array))  # type: ignore[reportArgumentType]
        model = eqx.apply_updates(model, updates)
        return model, opt_state, {**metrics, "loss": loss}

    return step
