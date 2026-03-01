from pathlib import Path

import equinox as eqx
import jax
import jax.numpy as jnp
import jax.random as jr
import optax
import structlog

from .data import fetch_sequences, logits_to_sequence, one_hot, tokenize
from .model import VAE
from .schema import EpochMetrics, Interpolation, LatentPoint, Reconstruction, Run
from .train import make_step_fn

log = structlog.get_logger()

FAMILY = "PF00397"
MAX_SEQS = 500
MAX_LEN = 40
HIDDEN = 256
LATENT = 2
LR = 1e-3
EPOCHS = 200
BATCH_SIZE = 64
KL_ANNEAL_EPOCHS = 50
N_RECONSTRUCTIONS = 10
N_INTERPOLATIONS = 3
N_INTERPOLATION_STEPS = 8
N_SAMPLES = 10

OUTPUT_DIR = Path(__file__).parent.parent.parent
OUTPUT_FILE = OUTPUT_DIR / "run.json"


def main() -> None:
    key = jr.PRNGKey(42)

    sequences = fetch_sequences(FAMILY, max_seqs=MAX_SEQS)
    tokens = tokenize(sequences, MAX_LEN)
    data = one_hot(tokens)
    n = data.shape[0]
    log.info("dataset_loaded", n_sequences=n, seq_len=MAX_LEN, vocab=data.shape[2])

    key, init_key = jr.split(key)
    model = VAE(seq_len=MAX_LEN, hidden=HIDDEN, latent=LATENT, key=init_key)
    n_params = sum(x.size for x in jax.tree.leaves(eqx.filter(model, eqx.is_array)))
    log.info("model_created", n_params=n_params, latent_dim=LATENT)

    opt = optax.adam(LR)
    opt_state = opt.init(eqx.filter(model, eqx.is_array))
    step_fn = make_step_fn(opt)

    training: list[EpochMetrics] = []

    for epoch in range(EPOCHS):
        key, epoch_key = jr.split(key)
        perm = jr.permutation(epoch_key, n)
        beta = jnp.float32(min(1.0, epoch / KL_ANNEAL_EPOCHS))

        epoch_metrics: dict[str, float] = {"loss": 0.0, "recon": 0.0, "kl": 0.0}
        n_batches = 0

        for i in range(0, n, BATCH_SIZE):
            batch = data[perm[i : i + BATCH_SIZE]]
            key, step_key = jr.split(key)
            model, opt_state, metrics = step_fn(model, opt_state, batch, step_key, beta)
            for k, v in metrics.items():
                epoch_metrics[k] += float(v)
            n_batches += 1

        avg = {k: v / n_batches for k, v in epoch_metrics.items()}
        training.append(
            EpochMetrics(
                epoch=epoch,
                loss=round(avg["loss"], 4),
                recon=round(avg["recon"], 4),
                kl=round(avg["kl"], 4),
                beta=round(float(beta), 4),
            )
        )

        if epoch % 20 == 0 or epoch == EPOCHS - 1:
            log.info("epoch", **{k: round(v, 2) for k, v in avg.items()}, epoch=epoch, beta=round(float(beta), 2))

    log.info("collecting_results")

    latent_space = _collect_latent_space(model, data, sequences)
    key, reco_key, interp_key, sample_key = jr.split(key, 4)
    reconstructions = _collect_reconstructions(model, data, sequences, key=reco_key)
    interpolations = _collect_interpolations(model, data, sequences, key=interp_key)
    samples = _collect_samples(model, key=sample_key)

    run = Run(
        training=training,
        latent_space=latent_space,
        reconstructions=reconstructions,
        interpolations=interpolations,
        samples=samples,
    )

    OUTPUT_FILE.write_text(run.model_dump_json(indent=2))
    log.info("saved_run", path=str(OUTPUT_FILE))



def _collect_latent_space(model: VAE, data: jax.Array, sequences: list[str]) -> list[LatentPoint]:
    z_all = jax.vmap(model.encode)(data)
    return [
        LatentPoint(z=[round(float(z_all[i, 0]), 4), round(float(z_all[i, 1]), 4)], sequence=seq[:MAX_LEN])
        for i, seq in enumerate(sequences)
    ]


def _collect_reconstructions(
    model: VAE, data: jax.Array, sequences: list[str], *, key: jax.Array
) -> list[Reconstruction]:
    indices = jr.choice(key, data.shape[0], shape=(N_RECONSTRUCTIONS,), replace=False)
    results: list[Reconstruction] = []
    for idx in indices:
        i = int(idx)
        x = data[i]
        key, k = jr.split(key)
        logits, _, _ = model(x, key=k)
        reconstructed = logits_to_sequence(logits)
        original = sequences[i][:MAX_LEN]
        accuracy = sum(a == b for a, b in zip(original, reconstructed)) / len(original)
        results.append(Reconstruction(original=original, reconstructed=reconstructed, accuracy=round(accuracy, 4)))
    return results


def _collect_interpolations(
    model: VAE, data: jax.Array, sequences: list[str], *, key: jax.Array
) -> list[Interpolation]:
    indices = jr.choice(key, data.shape[0], shape=(N_INTERPOLATIONS, 2), replace=False)
    results: list[Interpolation] = []
    for pair in indices:
        i, j = int(pair[0]), int(pair[1])
        z_start = model.encode(data[i])
        z_end = model.encode(data[j])
        alphas = jnp.linspace(0.0, 1.0, N_INTERPOLATION_STEPS)
        steps: list[str] = []
        z_steps: list[list[float]] = []
        for alpha in alphas:
            z = (1 - alpha) * z_start + alpha * z_end
            logits = model.decoder(z)
            steps.append(logits_to_sequence(logits))
            z_steps.append([round(float(z[0]), 4), round(float(z[1]), 4)])
        results.append(
            Interpolation(
                start=sequences[i][:MAX_LEN],
                end=sequences[j][:MAX_LEN],
                steps=steps,
                z_steps=z_steps,
            )
        )
    return results


def _collect_samples(model: VAE, *, key: jax.Array) -> list[str]:
    logits = model.sample(key=key, n=N_SAMPLES)
    return [logits_to_sequence(logits[i]) for i in range(N_SAMPLES)]


if __name__ == "__main__":
    main()
