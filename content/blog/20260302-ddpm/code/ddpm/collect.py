import base64
from pathlib import Path

import jax.numpy as jnp
import jax.random as jr
import structlog
from jaxtyping import Array, Int, PRNGKeyArray

from .config import (
    CHARSET,
    CHECKPOINT_DIR,
    FORWARD_STEPS,
    IMG_CHANNELS,
    IMG_SIZE,
    N_DENOISING_EXAMPLES,
    N_FORWARD_EXAMPLES,
    N_SAMPLES,
    OUTPUT_FILE,
)
from .model import UNet
from .sample import ddpm_sample_with_intermediates, sample_batch
from .schedule import NoiseSchedule, q_sample
from .schema import (
    DenoisingExample,
    DenoisingStep,
    EpochMetrics,
    ForwardProcessExample,
    ForwardProcessStep,
    NoiseScheduleData,
    Run,
    Sample,
    TrainingSample,
)
from .sdf import SDFNormalizer, sdf_to_b64
from .types import ImageBatch

log = structlog.get_logger()


def collect_noise_schedule(schedule: NoiseSchedule) -> NoiseScheduleData:
    indices = list(range(0, schedule.T, max(1, schedule.T // 100)))
    return NoiseScheduleData(
        t=[int(i) for i in indices],
        beta=[round(float(schedule.betas[i]), 6) for i in indices],
        alpha=[round(float(schedule.alphas[i]), 6) for i in indices],
        alpha_bar=[round(float(schedule.alpha_bars[i]), 6) for i in indices],
    )


def collect_forward_process(
    data: ImageBatch,
    schedule: NoiseSchedule,
    normalizer: SDFNormalizer,
    *,
    key: PRNGKeyArray,
) -> list[ForwardProcessExample]:
    key, choice_key = jr.split(key)
    indices = jr.choice(
        choice_key, data.shape[0], shape=(N_FORWARD_EXAMPLES,), replace=False
    )
    results: list[ForwardProcessExample] = []

    for idx in indices:
        x0 = data[int(idx)]
        original = sdf_to_b64(x0, normalizer)
        steps: list[ForwardProcessStep] = []

        for t_val in FORWARD_STEPS:
            key, noise_key = jr.split(key)
            t = jnp.array([t_val])
            noise = jr.normal(noise_key, x0[None].shape)
            x_noisy = q_sample(x0[None], t, noise, schedule)[0]
            steps.append(
                ForwardProcessStep(t=t_val, image=sdf_to_b64(x_noisy, normalizer, mode="field"))
            )

        results.append(ForwardProcessExample(original=original, steps=steps))
    return results


def collect_denoising(
    model: UNet,
    schedule: NoiseSchedule,
    normalizer: SDFNormalizer,
    *,
    key: PRNGKeyArray,
) -> list[DenoisingExample]:
    results: list[DenoisingExample] = []
    for i in range(N_DENOISING_EXAMPLES):
        key, sample_key = jr.split(key)
        shape = (IMG_CHANNELS, IMG_SIZE, IMG_SIZE)
        label_idx = i % len(CHARSET)
        label = jnp.array(label_idx)
        _, intermediates = ddpm_sample_with_intermediates(
            model,
            schedule,
            shape,
            label=label,
            key=sample_key,
            capture_every=100,
        )
        steps = [
            DenoisingStep(t=t, image=sdf_to_b64(img, normalizer, mode="field"))
            for t, img in intermediates
        ]
        results.append(
            DenoisingExample(steps=steps, label=label_idx, letter=CHARSET[label_idx])
        )
    return results


def collect_samples(
    model: UNet,
    schedule: NoiseSchedule,
    normalizer: SDFNormalizer,
    *,
    key: PRNGKeyArray,
) -> list[Sample]:
    shape = (IMG_CHANNELS, IMG_SIZE, IMG_SIZE)
    # Sample one glyph per character spread across charset
    step = max(1, len(CHARSET) // N_SAMPLES)
    selected = [i * step for i in range(N_SAMPLES)]
    labels = jnp.array(selected)
    batch = sample_batch(model, schedule, N_SAMPLES, shape, key=key, labels=labels)
    samples: list[Sample] = []
    for i in range(N_SAMPLES):
        label_idx = selected[i]
        samples.append(
            Sample(
                image=sdf_to_b64(batch[i], normalizer),
                label=label_idx,
                letter=CHARSET[label_idx],
            )
        )
        log.info("sample_done", i=i + 1, total=N_SAMPLES, letter=CHARSET[label_idx])
    return samples


def collect_and_save(
    ema_model: UNet,
    schedule: NoiseSchedule,
    data: ImageBatch,
    normalizer: SDFNormalizer,
    training: list[EpochMetrics],
    training_samples: list[TrainingSample],
    *,
    key: PRNGKeyArray,
) -> None:
    log.info("collecting_results", using="ema_model")

    noise_schedule = collect_noise_schedule(schedule)
    key, fwd_key, den_key, samp_key = jr.split(key, 4)
    forward_process = collect_forward_process(data, schedule, normalizer, key=fwd_key)
    denoising = collect_denoising(ema_model, schedule, normalizer, key=den_key)
    samples = collect_samples(ema_model, schedule, normalizer, key=samp_key)

    run = Run(
        training=training,
        training_samples=training_samples,
        noise_schedule=noise_schedule,
        forward_process=forward_process,
        denoising=denoising,
        samples=samples,
    )

    OUTPUT_FILE.write_text(run.model_dump_json(indent=2))
    log.info("saved_run", path=str(OUTPUT_FILE))


def load_training_samples() -> list[TrainingSample]:
    if not CHECKPOINT_DIR.exists():
        return []

    def _read_epoch(epoch_dir: Path) -> TrainingSample | None:
        images = [
            base64.b64encode(p.read_bytes()).decode()
            for p in sorted((epoch_dir / "samples").glob("sample_*.png"))
        ]
        if not images:
            return None
        return TrainingSample(epoch=int(epoch_dir.name.split("_")[1]), images=images)

    return [
        s
        for epoch_dir in sorted(CHECKPOINT_DIR.glob("epoch_*"))
        if (s := _read_epoch(epoch_dir)) is not None
    ]
