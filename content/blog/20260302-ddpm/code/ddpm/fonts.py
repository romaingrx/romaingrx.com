import urllib.parse
import urllib.request
import json
from pathlib import Path

import jax.numpy as jnp
import numpy as np
import structlog
from jaxtyping import Array, Float, Int
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import distance_transform_edt

from .config import CHARSET, IMG_SIZE
from .sdf import SDFNormalizer

log = structlog.get_logger()

GOOGLE_FONTS_METADATA = "https://fonts.google.com/metadata/fonts"
GOOGLE_FONTS_CSS = "https://fonts.googleapis.com/css2"
FONT_WEIGHT = 700  # bold
FONT_CATEGORIES = {"Sans Serif", "Serif"}


def render_glyph(font_path: Path, char: str, size: int = IMG_SIZE) -> np.ndarray | None:
    try:
        font = ImageFont.truetype(str(font_path), size)
    except Exception:
        return None

    bbox = font.getbbox(char)
    if bbox is None:
        return None
    x0, y0, x1, y1 = bbox
    gw, gh = x1 - x0, y1 - y0
    if gw < 2 or gh < 2:
        return None

    # Scale font to fill ~80% of canvas
    scale = 0.8 * size / max(gw, gh)
    font_size = max(8, int(size * scale))
    try:
        font = ImageFont.truetype(str(font_path), font_size)
    except Exception:
        return None

    bbox = font.getbbox(char)
    if bbox is None:
        return None
    x0, y0, x1, y1 = bbox
    gw, gh = x1 - x0, y1 - y0

    img = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(img)
    cx = (size - gw) // 2 - x0
    cy = (size - gh) // 2 - y0
    draw.text((cx, cy), char, fill=255, font=font)
    return np.array(img)


def compute_sdf(binary: np.ndarray) -> np.ndarray:
    mask = binary > 128
    dist_outside = distance_transform_edt(~mask)
    dist_inside = distance_transform_edt(mask)
    return dist_outside - dist_inside  # negative inside, positive outside


def _get_ttf_url(family: str, weight: int = FONT_WEIGHT) -> str | None:
    import re

    css_url = (
        f"{GOOGLE_FONTS_CSS}?family={urllib.parse.quote(family)}"
        f":wght@{weight}&display=swap"
    )
    req = urllib.request.Request(css_url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req) as resp:  # noqa: S310
            css = resp.read().decode()
    except Exception:
        return None
    if f"font-weight: {weight}" not in css:
        return None
    match = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+\.ttf)\)", css)
    return match.group(1) if match else None


def _download_fonts(cache_dir: Path, max_fonts: int | None = None) -> list[Path]:
    fonts_dir = cache_dir / "fonts"
    fonts_dir.mkdir(parents=True, exist_ok=True)

    manifest = cache_dir / "fonts_manifest.json"
    if manifest.exists():
        with open(manifest) as f:
            font_paths = [fonts_dir / name for name in json.load(f)]
        font_paths = [p for p in font_paths if p.exists()]
        if font_paths:
            log.info("fonts_cached", n_fonts=len(font_paths))
            return font_paths[:max_fonts] if max_fonts else font_paths

    log.info("fetching_font_list")
    req = urllib.request.Request(
        GOOGLE_FONTS_METADATA, headers={"User-Agent": "Mozilla/5.0"}
    )
    with urllib.request.urlopen(req) as resp:  # noqa: S310
        data = json.loads(resp.read())

    families = [
        item["family"]
        for item in data["familyMetadataList"]
        if item.get("category") in FONT_CATEGORIES
    ]
    log.info("filtered_fonts", total=len(families), categories=list(FONT_CATEGORIES))
    if max_fonts:
        families = families[:max_fonts]

    font_paths: list[Path] = []
    for family in families:
        safe_name = family.replace(" ", "_") + ".ttf"
        ttf_path = fonts_dir / safe_name
        if not ttf_path.exists():
            ttf_url = _get_ttf_url(family)
            if not ttf_url:
                continue
            try:
                urllib.request.urlretrieve(ttf_url, ttf_path)  # noqa: S310
            except Exception:
                log.warning("font_download_failed", family=family)
                continue

        font_paths.append(ttf_path)
        if len(font_paths) % 100 == 0:
            log.info("fonts_downloaded", count=len(font_paths))

    log.info("fonts_download_complete", total=len(font_paths))

    with open(manifest, "w") as f:
        json.dump([p.name for p in font_paths], f)

    return font_paths


def prepare_glyphs(
    cache_dir: Path, *, max_fonts: int | None = None
) -> tuple[np.ndarray, np.ndarray]:
    sdfs_path = cache_dir / "sdfs_raw.npy"
    labels_path = cache_dir / "labels.npy"

    if sdfs_path.exists() and labels_path.exists():
        log.info("glyphs_cached", sdfs=str(sdfs_path))
        sdfs = np.load(sdfs_path, mmap_mode="r")
        labels = np.load(labels_path, mmap_mode="r")
        return sdfs, labels

    font_paths = _download_fonts(cache_dir, max_fonts=max_fonts)

    all_sdfs: list[np.ndarray] = []
    all_labels: list[int] = []

    for font_path in font_paths:
        for label_idx, char in enumerate(CHARSET):
            binary = render_glyph(font_path, char)
            if binary is None:
                continue
            sdf = compute_sdf(binary)
            all_sdfs.append(sdf)
            all_labels.append(label_idx)

        if len(all_sdfs) % 5000 == 0:
            log.info("glyphs_rendered", count=len(all_sdfs))

    sdfs = np.stack(all_sdfs).astype(np.float32)
    labels = np.array(all_labels, dtype=np.int32)

    log.info("saving_raw_sdfs", n=len(sdfs), shape=sdfs.shape)
    np.save(sdfs_path, sdfs)
    np.save(labels_path, labels)

    return sdfs, labels


def load_glyphs(
    cache_dir: Path, normalizer: SDFNormalizer, *, max_fonts: int | None = None
) -> tuple[Float[Array, "n 1 h w"], Int[Array, " n"]]:
    raw_sdfs, labels = prepare_glyphs(cache_dir, max_fonts=max_fonts)
    data = normalizer.normalize(np.array(raw_sdfs))
    data = jnp.array(data[:, None, :, :])  # (n, 1, 64, 64)
    return data, jnp.array(labels)
