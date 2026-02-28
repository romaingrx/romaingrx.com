from typing import TypeAlias

from jaxtyping import Array, Float

AMINO_ACIDS: str = "ACDEFGHIKLMNPQRSTVWY"
VOCAB_SIZE: int = len(AMINO_ACIDS)
PAD_IDX: int = VOCAB_SIZE
AA_TO_IDX: dict[str, int] = {aa: i for i, aa in enumerate(AMINO_ACIDS)}
IDX_TO_AA: dict[int, str] = {i: aa for i, aa in enumerate(AMINO_ACIDS)}

Scalar: TypeAlias = Float[Array, ""]
