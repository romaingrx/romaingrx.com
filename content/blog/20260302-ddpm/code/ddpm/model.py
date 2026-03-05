import math

import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
from einops import rearrange
from jaxtyping import Array, Float, Int, PRNGKeyArray

from .config import IMG_CHANNELS


class SinusoidalEmbedding(eqx.Module):
    dim: int = eqx.field(static=True)

    def __call__(self, t: Int[Array, ""]) -> Float[Array, " dim"]:
        half = self.dim // 2
        freqs = jnp.exp(-math.log(10000.0) * jnp.arange(half) / half)
        args = t.astype(jnp.float32) * freqs
        return jnp.concatenate([jnp.sin(args), jnp.cos(args)])


class TimeMLPBlock(eqx.Module):
    linear: eqx.nn.Linear

    def __init__(self, time_dim: int, channels: int, *, key: PRNGKeyArray):
        self.linear = eqx.nn.Linear(time_dim, channels, key=key)

    def __call__(self, t_emb: Float[Array, " time_dim"]) -> Float[Array, " channels"]:
        return jax.nn.silu(self.linear(t_emb))


class ResNetBlock(eqx.Module):
    conv1: eqx.nn.Conv2d
    conv2: eqx.nn.Conv2d
    norm1: eqx.nn.GroupNorm
    norm2: eqx.nn.GroupNorm
    time_mlp: TimeMLPBlock
    dropout: eqx.nn.Dropout
    skip_conv: eqx.nn.Conv2d | None

    def __init__(
        self,
        in_ch: int,
        out_ch: int,
        time_dim: int,
        *,
        dropout_rate: float = 0.0,
        key: PRNGKeyArray,
    ):
        k1, k2, k3, k4 = jr.split(key, 4)
        self.conv1 = eqx.nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=1, key=k1)
        self.conv2 = eqx.nn.Conv2d(out_ch, out_ch, kernel_size=3, padding=1, key=k2)
        self.norm1 = eqx.nn.GroupNorm(min(8, out_ch), out_ch)
        self.norm2 = eqx.nn.GroupNorm(min(8, out_ch), out_ch)
        self.time_mlp = TimeMLPBlock(time_dim, out_ch, key=k3)
        self.dropout = eqx.nn.Dropout(p=dropout_rate)
        self.skip_conv = (
            eqx.nn.Conv2d(in_ch, out_ch, kernel_size=1, key=k4)
            if in_ch != out_ch
            else None
        )

    def __call__(
        self,
        x: Float[Array, "c h w"],
        t_emb: Float[Array, " time_dim"],
        *,
        key: PRNGKeyArray,
    ) -> Float[Array, "out_ch h w"]:
        h = jax.nn.silu(self.norm1(self.conv1(x)))
        h = h + self.time_mlp(t_emb)[:, None, None]
        h = self.dropout(h, key=key)
        h = jax.nn.silu(self.norm2(self.conv2(h)))
        skip = self.skip_conv(x) if self.skip_conv is not None else x
        return h + skip


class SelfAttention(eqx.Module):
    n_heads: int = eqx.field(static=True)
    norm: eqx.nn.GroupNorm
    qkv: eqx.nn.Conv2d
    proj: eqx.nn.Conv2d

    def __init__(self, channels: int, n_heads: int = 4, *, key: PRNGKeyArray):
        k1, k2 = jr.split(key)
        self.n_heads = n_heads
        self.norm = eqx.nn.GroupNorm(min(8, channels), channels)
        self.qkv = eqx.nn.Conv2d(channels, channels * 3, kernel_size=1, key=k1)
        self.proj = eqx.nn.Conv2d(channels, channels, kernel_size=1, key=k2)

    def __call__(self, x: Float[Array, "c h w"]) -> Float[Array, "c h w"]:
        c, h, w = x.shape
        normed = self.norm(x)
        qkv = self.qkv(normed)
        qkv_flat = rearrange(
            qkv,
            "(three heads d) h w -> three heads (h w) d",
            three=3,
            heads=self.n_heads,
        )
        q, k, v = qkv_flat[0], qkv_flat[1], qkv_flat[2]
        out = jax.nn.dot_product_attention(q, k, v)
        out = rearrange(out, "heads (h w) d -> (heads d) h w", h=h, w=w)
        return x + self.proj(out)


class Downsample(eqx.Module):
    conv: eqx.nn.Conv2d

    def __init__(self, channels: int, *, key: PRNGKeyArray):
        self.conv = eqx.nn.Conv2d(
            channels, channels, kernel_size=3, stride=2, padding=1, key=key
        )

    def __call__(self, x: Float[Array, "c h w"]) -> Float[Array, "c h2 w2"]:
        return self.conv(x)


class Upsample(eqx.Module):
    conv: eqx.nn.Conv2d

    def __init__(self, channels: int, *, key: PRNGKeyArray):
        self.conv = eqx.nn.Conv2d(channels, channels, kernel_size=3, padding=1, key=key)

    def __call__(self, x: Float[Array, "c h w"]) -> Float[Array, "c h2 w2"]:
        _, h, w = x.shape
        x = jax.image.resize(x, (x.shape[0], h * 2, w * 2), method="nearest")
        return self.conv(x)


class UNet(eqx.Module):
    time_embed: SinusoidalEmbedding
    time_mlp: eqx.nn.MLP
    conv_in: eqx.nn.Conv2d

    enc_blocks: list[list[ResNetBlock]]
    enc_attns: list[SelfAttention | None]
    downsamples: list[Downsample]

    mid_block1: ResNetBlock
    mid_attn: SelfAttention
    mid_block2: ResNetBlock

    dec_blocks: list[list[ResNetBlock]]
    dec_attns: list[SelfAttention | None]
    upsamples: list[Upsample]

    out_norm: eqx.nn.GroupNorm
    conv_out: eqx.nn.Conv2d

    channel_mults: tuple[int, ...] = eqx.field(static=True)
    attn_resolutions: tuple[int, ...] = eqx.field(static=True)

    def __init__(
        self,
        img_channels: int = IMG_CHANNELS,
        base_channels: int = 64,
        channel_mults: tuple[int, ...] = (1, 2, 4),
        attn_resolutions: tuple[int, ...] = (16, 8),
        img_size: int = 64,
        dropout_rate: float = 0.0,
        *,
        key: PRNGKeyArray,
    ):
        self.channel_mults = channel_mults
        self.attn_resolutions = attn_resolutions
        time_dim = base_channels * 4

        def next_key() -> PRNGKeyArray:
            nonlocal key
            key, subkey = jr.split(key)
            return subkey

        self.time_embed = SinusoidalEmbedding(base_channels)
        self.time_mlp = eqx.nn.MLP(
            base_channels, time_dim, width_size=time_dim, depth=1, key=next_key()
        )
        self.conv_in = eqx.nn.Conv2d(
            img_channels, base_channels, kernel_size=3, padding=1, key=next_key()
        )

        self.enc_blocks = []
        self.enc_attns = []
        self.downsamples = []
        in_ch = base_channels
        res = img_size

        for mult in channel_mults:
            out_ch = base_channels * mult
            level_blocks = [
                ResNetBlock(
                    in_ch, out_ch, time_dim, dropout_rate=dropout_rate, key=next_key()
                ),
                ResNetBlock(
                    out_ch, out_ch, time_dim, dropout_rate=dropout_rate, key=next_key()
                ),
            ]
            self.enc_blocks.append(level_blocks)

            attn = (
                SelfAttention(out_ch, key=next_key())
                if res in attn_resolutions
                else None
            )
            self.enc_attns.append(attn)

            self.downsamples.append(Downsample(out_ch, key=next_key()))

            in_ch = out_ch
            res = res // 2

        self.mid_block1 = ResNetBlock(
            in_ch, in_ch, time_dim, dropout_rate=dropout_rate, key=next_key()
        )
        self.mid_attn = SelfAttention(in_ch, key=next_key())
        self.mid_block2 = ResNetBlock(
            in_ch, in_ch, time_dim, dropout_rate=dropout_rate, key=next_key()
        )

        self.dec_blocks = []
        self.dec_attns = []
        self.upsamples = []

        for mult in reversed(channel_mults):
            out_ch = base_channels * mult
            skip_ch = out_ch

            self.upsamples.append(Upsample(in_ch, key=next_key()))
            res = res * 2

            level_blocks = [
                ResNetBlock(
                    in_ch + skip_ch,
                    out_ch,
                    time_dim,
                    dropout_rate=dropout_rate,
                    key=next_key(),
                ),
                ResNetBlock(
                    out_ch, out_ch, time_dim, dropout_rate=dropout_rate, key=next_key()
                ),
            ]
            self.dec_blocks.append(level_blocks)

            attn = (
                SelfAttention(out_ch, key=next_key())
                if res in attn_resolutions
                else None
            )
            self.dec_attns.append(attn)

            in_ch = out_ch

        self.out_norm = eqx.nn.GroupNorm(min(8, in_ch), in_ch)
        self.conv_out = eqx.nn.Conv2d(
            in_ch, img_channels, kernel_size=1, key=next_key()
        )

    def __call__(
        self,
        x: Float[Array, "c h w"],
        t: Int[Array, ""],
        *,
        key: PRNGKeyArray | None = None,
    ) -> Float[Array, "c h w"]:
        t_emb = self.time_embed(t)
        t_emb = self.time_mlp(t_emb)
        inference = key is None

        def next_key() -> PRNGKeyArray:
            nonlocal key
            assert key is not None
            key, subkey = jr.split(key)
            return subkey

        def apply_block(
            block: ResNetBlock, h: Float[Array, "_ h w"]
        ) -> Float[Array, "_ h w"]:
            if inference:
                return eqx.nn.inference_mode(block)(h, t_emb, key=jr.PRNGKey(0))
            return block(h, t_emb, key=next_key())

        h = self.conv_in(x)

        skips: list[Float[Array, "..."]] = []
        for blocks, attn, down in zip(
            self.enc_blocks, self.enc_attns, self.downsamples
        ):
            for block in blocks:
                h = apply_block(block, h)
            if attn is not None:
                h = attn(h)
            skips.append(h)
            h = down(h)

        h = apply_block(self.mid_block1, h)
        h = self.mid_attn(h)
        h = apply_block(self.mid_block2, h)

        for blocks, attn, up, skip in zip(
            self.dec_blocks, self.dec_attns, self.upsamples, reversed(skips)
        ):
            h = up(h)
            h = jnp.concatenate([h, skip], axis=0)
            for block in blocks:
                h = apply_block(block, h)
            if attn is not None:
                h = attn(h)

        h = jax.nn.silu(self.out_norm(h))
        return self.conv_out(h)
