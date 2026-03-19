#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["pillow"]
# ///
"""Generate a DDPM blog cover showing the denoising process for several letters."""

import base64
import io
import json
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).parent
RUN = json.loads((HERE / "run.json").read_text())

N_STEPS = 6
GLYPH_SIZE = 128
GAP = 8
PADDING = 12
RADIUS = 12
BG = (0, 0, 0, 0)


def b64_to_img(b64: str) -> Image.Image:
    return Image.open(io.BytesIO(base64.b64decode(b64))).convert("L")


def round_corners(img: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([(0, 0), img.size], radius, fill=255)
    out = img.copy()
    out.putalpha(mask)
    return out


def main():
    examples = RUN["denoising"][:3]

    rows: list[list[Image.Image]] = []
    for ex in examples:
        steps = ex["steps"]
        indices = [int(i * (len(steps) - 1) / (N_STEPS - 1)) for i in range(N_STEPS)]
        row = [b64_to_img(steps[i]["image"]).resize((GLYPH_SIZE, GLYPH_SIZE), Image.NEAREST) for i in indices]
        rows.append(row)

    n_rows = len(rows)
    total_w = N_STEPS * GLYPH_SIZE + (N_STEPS - 1) * GAP + 2 * PADDING
    total_h = n_rows * GLYPH_SIZE + (n_rows - 1) * GAP + 2 * PADDING

    cover = Image.new("RGBA", (total_w, total_h), BG)

    for r, row in enumerate(rows):
        y = PADDING + r * (GLYPH_SIZE + GAP)
        for c, img in enumerate(row):
            x = PADDING + c * (GLYPH_SIZE + GAP)
            glyph = Image.new("RGBA", (GLYPH_SIZE, GLYPH_SIZE), (0, 0, 0, 255))
            glyph.paste(Image.merge("RGBA", (img, img, img, Image.new("L", img.size, 255))), (0, 0))
            glyph = round_corners(glyph, RADIUS)
            cover.paste(glyph, (x, y), glyph)

    out = HERE / "images" / "cover.png"
    out.parent.mkdir(exist_ok=True)
    cover.save(out)
    print(f"Saved {out} ({cover.size[0]}x{cover.size[1]})")


if __name__ == "__main__":
    main()
