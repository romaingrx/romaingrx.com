import base64
import io
from pathlib import Path

import jax
import jax.numpy as jnp
import numpy as np
from jaxtyping import Array, Float
from PIL import Image

from .config import IMG_SIZE


def load_pokemon(cache_dir: Path, *, augment: bool = True) -> Float[Array, "n c h w"]:
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_file = cache_dir / "pokemon.npz"

    if not cache_file.exists():
        from datasets import load_dataset  # type: ignore[reportMissingModuleSource]

        ds = load_dataset("svjack/pokemon-blip-captions-en-zh", split="train")
        images: list[np.ndarray] = []
        for item in ds:  # type: ignore[reportUnknownVariableType]
            img = item["image"]  # type: ignore[reportUnknownMemberType]
            if img.mode != "RGB":  # type: ignore[reportUnknownMemberType]
                img = img.convert("RGB")  # type: ignore[reportUnknownMemberType]
            images.append(np.array(img))  # type: ignore[reportUnknownArgumentType]
        np.savez_compressed(cache_file, images=np.array(images, dtype=object))

    data = np.load(cache_file, allow_pickle=True)
    raw_images: list[np.ndarray] = list(data["images"])
    return preprocess(raw_images, IMG_SIZE, augment=augment)


def preprocess(
    images: list[np.ndarray], size: int, *, augment: bool = True
) -> Float[Array, "n c h w"]:
    processed: list[np.ndarray] = []
    for img in images:
        pil_img = Image.fromarray(img)
        pil_img = pil_img.resize((size, size), Image.Resampling.LANCZOS)
        arr = np.array(pil_img, dtype=np.float32) / 127.5 - 1.0
        arr = np.transpose(arr, (2, 0, 1))
        processed.append(arr)
        if augment:
            processed.append(arr[:, :, ::-1].copy())
    return jnp.array(np.stack(processed))


def array_to_b64(img: jax.Array) -> str:
    arr = np.array(img)
    arr = np.transpose(arr, (1, 2, 0))
    arr = ((arr + 1.0) * 127.5).clip(0, 255).astype(np.uint8)
    pil_img = Image.fromarray(arr)
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()
