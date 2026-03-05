# DDPM Pokemon

Denoising Diffusion Probabilistic Model for Pokemon sprite generation, implemented in JAX/Equinox.

## Setup

```bash
uv sync --all-extras
```

## Usage

```bash
ddpm train          # train the model
ddpm sample         # generate samples from a checkpoint
ddpm resample       # resample validation images from a checkpoint
```

Use `--verbose` for detailed logging.

## Testing

```bash
uv run --extra test pytest
```
