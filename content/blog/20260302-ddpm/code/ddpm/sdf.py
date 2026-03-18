import base64
import io
from dataclasses import dataclass
from typing import Any

import numpy as np
from jaxtyping import Array, Float
from PIL import Image


@dataclass
class SDFNormalizer:
    clamp_min: float = -5.0
    clamp_max: float = 5.0

    def normalize(self, raw_sdf: np.ndarray) -> np.ndarray:
        clamped = np.clip(raw_sdf, self.clamp_min, self.clamp_max)
        return 2.0 * (clamped - self.clamp_min) / (self.clamp_max - self.clamp_min) - 1.0

    def denormalize(self, normalized: np.ndarray) -> np.ndarray:
        return (normalized + 1.0) / 2.0 * (self.clamp_max - self.clamp_min) + self.clamp_min

    def to_image(self, normalized_sdf: np.ndarray, mode: str = "threshold") -> np.ndarray:
        if mode == "threshold":
            raw = self.denormalize(normalized_sdf)
            return (raw < 0).astype(np.uint8) * 255
        # "field" mode: visualize the distance field as grayscale
        return ((normalized_sdf + 1.0) * 127.5).clip(0, 255).astype(np.uint8)

    def to_dict(self) -> dict[str, float]:
        return {"clamp_min": self.clamp_min, "clamp_max": self.clamp_max}

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "SDFNormalizer":
        return cls(clamp_min=d["clamp_min"], clamp_max=d["clamp_max"])


def sdf_to_b64(img: Float[Array, "..."], normalizer: SDFNormalizer, mode: str = "threshold") -> str:
    arr = np.asarray(img)
    if arr.ndim == 3:
        arr = arr[0]  # (1, H, W) -> (H, W)
    pixels = normalizer.to_image(arr, mode=mode)
    pil_img = Image.fromarray(pixels, mode="L")
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()
