from pathlib import Path

import jax

from .model import UNet
from .types import IMG_CHANNELS, IMG_SIZE

TIMESTEPS = 1000
BASE_CHANNELS = 48
CHANNEL_MULTS = (1, 2, 4)
ATTN_RESOLUTIONS = (16, 8)
LR = 2e-4
EPOCHS = 3000
BATCH_SIZE = 64
EMA_DECAY = 0.999
CHECKPOINT_EVERY = 250
N_FORWARD_EXAMPLES = 3
FORWARD_STEPS = [0, 50, 100, 250, 500, 750, 999]
N_DENOISING_EXAMPLES = 1
N_SAMPLES = 8
N_VALIDATION_SAMPLES = 3

CODE_DIR = Path(__file__).parent.parent
OUTPUT_FILE = CODE_DIR.parent / "run.json"
CACHE_DIR = CODE_DIR / ".cache"
CHECKPOINT_DIR = CODE_DIR / ".checkpoints"


def init_model(*, key: jax.Array) -> UNet:
    return UNet(
        img_channels=IMG_CHANNELS,
        base_channels=BASE_CHANNELS,
        channel_mults=CHANNEL_MULTS,
        attn_resolutions=ATTN_RESOLUTIONS,
        img_size=IMG_SIZE,
        key=key,
    )
