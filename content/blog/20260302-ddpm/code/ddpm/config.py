import logging
from pathlib import Path

import structlog

IMG_CHANNELS: int = 3
IMG_SIZE: int = 64

TIMESTEPS = 1000
BASE_CHANNELS = 48
CHANNEL_MULTS = (1, 2, 4)
ATTN_RESOLUTIONS = (16, 8)
LR = 2e-4
EPOCHS = 3000
BATCH_SIZE = 64
EMA_DECAY = 0.999
DROPOUT_RATE = 0.1
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


def configure_logging(*, verbose: bool = False) -> None:
    level = logging.DEBUG if verbose else logging.INFO

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.dev.ConsoleRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(level),
        logger_factory=structlog.PrintLoggerFactory(),
    )

    handler = logging.StreamHandler()
    handler.setFormatter(
        structlog.stdlib.ProcessorFormatter(
            processors=[
                structlog.stdlib.add_log_level,
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.dev.ConsoleRenderer(),
            ],
        )
    )
    logging.basicConfig(handlers=[handler], level=level, force=True)
