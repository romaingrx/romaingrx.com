from typing import TypeAlias

from jaxtyping import Array, Float, Int

Scalar: TypeAlias = Float[Array, ""]
Image: TypeAlias = Float[Array, "c h w"]
ImageBatch: TypeAlias = Float[Array, "b c h w"]
Label: TypeAlias = Int[Array, ""]
LabelBatch: TypeAlias = Int[Array, " b"]
