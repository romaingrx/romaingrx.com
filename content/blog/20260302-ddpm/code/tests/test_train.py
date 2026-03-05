import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
import optax

from ddpm.model import UNet
from ddpm.schedule import cosine_schedule
from ddpm.train import _make_train_epoch


def _tiny_model(*, key):
    """Minimal UNet: 4 base channels, single level, no attention, 8x8 images."""
    return UNet(
        img_channels=3,
        base_channels=4,
        channel_mults=(1,),
        attn_resolutions=(),
        img_size=8,
        dropout_rate=0.0,
        key=key,
    )


def test_single_epoch_runs():
    """Smoke test: one epoch completes and returns correct types."""
    key = jr.PRNGKey(0)
    k1, k2, k3 = jr.split(key, 3)

    model = _tiny_model(key=k1)
    schedule = cosine_schedule(10)
    opt = optax.adam(1e-3)
    opt_state = opt.init(eqx.filter(model, eqx.is_array))
    epoch_fn = _make_train_epoch(opt, schedule, ema_decay=0.99)

    batch = jr.normal(k2, (2, 3, 8, 8))  # 2 images
    batches = batch[None]  # 1 batch of 2
    keys = jr.split(k3, 1)

    model_out, ema_out, opt_out, loss = epoch_fn(
        model, model, opt_state, batches, keys
    )
    assert loss.shape == ()
    assert jnp.isfinite(loss)


def test_loss_decreases_on_repeated_data():
    """Overfitting test: loss should decrease when training on the same batch."""
    key = jr.PRNGKey(42)
    k1, k2 = jr.split(key)

    model = _tiny_model(key=k1)
    schedule = cosine_schedule(10)
    opt = optax.adam(1e-3)
    opt_state = opt.init(eqx.filter(model, eqx.is_array))
    epoch_fn = _make_train_epoch(opt, schedule, ema_decay=0.999)

    batch = jr.normal(k2, (4, 3, 8, 8))
    batches = jnp.stack([batch, batch])  # 2 identical batches per epoch

    ema_model = model
    losses = []
    for i in range(10):
        keys = jr.split(jr.PRNGKey(i), 2)
        model, ema_model, opt_state, loss = epoch_fn(
            model, ema_model, opt_state, batches, keys
        )
        losses.append(float(loss))

    assert losses[-1] < losses[0], f"Loss did not decrease: {losses[0]:.4f} -> {losses[-1]:.4f}"


def test_ema_differs_from_model():
    """EMA params should lag behind the trained model."""
    key = jr.PRNGKey(7)
    k1, k2 = jr.split(key)

    model = _tiny_model(key=k1)
    schedule = cosine_schedule(10)
    opt = optax.adam(1e-3)
    opt_state = opt.init(eqx.filter(model, eqx.is_array))
    epoch_fn = _make_train_epoch(opt, schedule, ema_decay=0.99)

    batch = jr.normal(k2, (4, 3, 8, 8))
    batches = batch[None]
    keys = jr.split(jr.PRNGKey(0), 1)

    ema_model = model
    model, ema_model, _, _ = epoch_fn(model, ema_model, opt_state, batches, keys)

    model_params = eqx.filter(model, eqx.is_array)
    ema_params = eqx.filter(ema_model, eqx.is_array)

    diffs = jax.tree.map(lambda m, e: jnp.max(jnp.abs(m - e)), model_params, ema_params)
    max_diff = max(float(d) for d in jax.tree.leaves(diffs))
    assert max_diff > 0, "EMA should differ from model after training"


def test_deterministic():
    """Same seed produces same loss."""
    def run(seed):
        key = jr.PRNGKey(seed)
        k1, k2 = jr.split(key)
        model = _tiny_model(key=k1)
        schedule = cosine_schedule(10)
        opt = optax.adam(1e-3)
        opt_state = opt.init(eqx.filter(model, eqx.is_array))
        epoch_fn = _make_train_epoch(opt, schedule, ema_decay=0.99)
        batches = jr.normal(k2, (1, 4, 3, 8, 8))
        keys = jr.split(jr.PRNGKey(0), 1)
        _, _, _, loss = epoch_fn(model, model, opt_state, batches, keys)
        return float(loss)

    assert run(0) == run(0)
    assert run(0) != run(1)


def test_gradients_finite():
    """All gradients should be finite and non-zero."""
    key = jr.PRNGKey(99)
    k1, k2, k3 = jr.split(key, 3)

    model = _tiny_model(key=k1)
    schedule = cosine_schedule(10)

    batch = jr.normal(k2, (4, 3, 8, 8))

    def loss_fn(model):
        from ddpm.schedule import q_sample
        t = jr.randint(k3, (4,), 0, schedule.T)
        noise = jr.normal(k3, batch.shape)
        x_noisy = q_sample(batch, t, noise, schedule)
        pred = jax.vmap(model)(x_noisy, t, key=jr.split(k3, 4))
        return jnp.mean((pred - noise) ** 2)

    grads = eqx.filter_grad(loss_fn)(model)
    grad_leaves = jax.tree.leaves(eqx.filter(grads, eqx.is_array))
    assert all(jnp.all(jnp.isfinite(g)) for g in grad_leaves), "Non-finite gradients"
    assert any(jnp.any(g != 0) for g in grad_leaves), "All gradients are zero"
