import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
from jaxtyping import Array, Float, PRNGKeyArray

from .types import VOCAB_SIZE


def reparameterize(
    mu: Float[Array, " latent"],
    logvar: Float[Array, " latent"],
    *,
    key: PRNGKeyArray,
) -> Float[Array, " latent"]:
    std = jnp.exp(0.5 * logvar)
    eps = jr.normal(key, mu.shape)
    return mu + std * eps


class Encoder(eqx.Module):
    """q(z|x): one-hot protein sequences to latent distribution parameters."""

    net: eqx.nn.MLP
    mu_head: eqx.nn.Linear
    logvar_head: eqx.nn.Linear

    def __init__(self, seq_len: int, hidden: int, latent: int, *, key: PRNGKeyArray):
        k1, k2, k3 = jr.split(key, 3)
        input_dim = seq_len * VOCAB_SIZE
        self.net = eqx.nn.MLP(input_dim, hidden, width_size=hidden, depth=1, key=k1)
        self.mu_head = eqx.nn.Linear(hidden, latent, key=k2)
        self.logvar_head = eqx.nn.Linear(hidden, latent, key=k3)

    def __call__(
        self, x: Float[Array, "seq vocab"]
    ) -> tuple[Float[Array, " latent"], Float[Array, " latent"]]:
        h = self.net(x.reshape(-1))
        return self.mu_head(h), self.logvar_head(h)


class Decoder(eqx.Module):
    """p(x|z): latent vectors to per-position amino acid logits."""

    net: eqx.nn.MLP
    seq_len: int = eqx.field(static=True)

    def __init__(self, seq_len: int, hidden: int, latent: int, *, key: PRNGKeyArray):
        output_dim = seq_len * VOCAB_SIZE
        self.net = eqx.nn.MLP(latent, output_dim, width_size=hidden, depth=1, key=key)
        self.seq_len = seq_len

    def __call__(self, z: Float[Array, " latent"]) -> Float[Array, "seq vocab"]:
        return self.net(z).reshape(self.seq_len, VOCAB_SIZE)


class VAE(eqx.Module):
    encoder: Encoder
    decoder: Decoder
    latent_dim: int = eqx.field(static=True)

    def __init__(
        self, seq_len: int, hidden: int = 256, latent: int = 2, *, key: PRNGKeyArray
    ):
        k1, k2 = jr.split(key)
        self.encoder = Encoder(seq_len, hidden, latent, key=k1)
        self.decoder = Decoder(seq_len, hidden, latent, key=k2)
        self.latent_dim = latent

    def __call__(
        self, x: Float[Array, "seq vocab"], *, key: PRNGKeyArray
    ) -> tuple[Float[Array, "seq vocab"], Float[Array, " latent"], Float[Array, " latent"]]:
        mu, logvar = self.encoder(x)
        z = reparameterize(mu, logvar, key=key)
        logits = self.decoder(z)
        return logits, mu, logvar

    def encode(self, x: Float[Array, "seq vocab"]) -> Float[Array, " latent"]:
        mu, _ = self.encoder(x)
        return mu

    def sample(self, *, key: PRNGKeyArray, n: int = 1) -> Float[Array, "n seq vocab"]:
        z = jr.normal(key, (n, self.latent_dim))
        return jax.vmap(self.decoder)(z)
