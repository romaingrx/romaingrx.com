import urllib.request
from pathlib import Path

import jax.numpy as jnp
from jaxtyping import Array, Float, Int

from .types import AA_TO_IDX, IDX_TO_AA, PAD_IDX, VOCAB_SIZE

UNIPROT_URL = (
    "https://rest.uniprot.org/uniprotkb/search"
    "?query=xref:pfam-{family}&format=fasta&size={max_seqs}"
)


def fetch_sequences(
    family: str = "PF00397",
    max_seqs: int = 500,
    cache_dir: Path | None = None,
) -> list[str]:
    """Fetch protein sequences for a Pfam family from UniProt, cached locally."""
    if cache_dir is None:
        cache_dir = Path(__file__).parent.parent / ".cache"
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_file = cache_dir / f"{family}.fasta"

    if not cache_file.exists():
        url = UNIPROT_URL.format(family=family, max_seqs=max_seqs)
        urllib.request.urlretrieve(url, cache_file)

    return _parse_fasta(cache_file)


def _parse_fasta(path: Path) -> list[str]:
    sequences: list[str] = []
    current: list[str] = []
    for line in path.read_text().splitlines():
        if line.startswith(">"):
            if current:
                sequences.append("".join(current))
            current = []
        else:
            current.append(line.strip())
    if current:
        sequences.append("".join(current))
    return sequences


def tokenize(sequences: list[str], max_len: int) -> Int[Array, "n seq"]:
    """Convert amino acid strings to integer tokens, padded/truncated to max_len."""

    tokens = []
    for seq in sequences:
        t = [AA_TO_IDX.get(aa, PAD_IDX) for aa in seq[:max_len]]
        t += [PAD_IDX] * (max_len - len(t))
        tokens.append(t)
    return jnp.array(tokens)


def one_hot(tokens: Int[Array, "n seq"]) -> Float[Array, "n seq vocab"]:
    """One-hot encode token indices. Padding tokens become zero vectors."""
    return (tokens[..., None] == jnp.arange(VOCAB_SIZE)).astype(jnp.float32)


def logits_to_sequence(logits: Float[Array, "seq vocab"]) -> str:
    """Decode logits back to an amino acid string."""
    indices = jnp.argmax(logits, axis=-1)
    return "".join(IDX_TO_AA.get(int(i), "?") for i in indices)
