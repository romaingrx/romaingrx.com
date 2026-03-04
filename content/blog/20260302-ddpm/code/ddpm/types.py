from typing import TypeAlias

from jaxtyping import Array, Float

IMG_CHANNELS: int = 3
IMG_SIZE: int = 64

Scalar: TypeAlias = Float[Array, ""]
Image: TypeAlias = Float[Array, "c h w"]
ImageBatch: TypeAlias = Float[Array, "b c h w"]
