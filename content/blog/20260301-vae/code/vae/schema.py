from pydantic import BaseModel


class EpochMetrics(BaseModel):
    epoch: int
    loss: float
    recon: float
    kl: float
    beta: float


class LatentPoint(BaseModel):
    z: list[float]
    sequence: str


class Reconstruction(BaseModel):
    original: str
    reconstructed: str
    accuracy: float


class Interpolation(BaseModel):
    start: str
    end: str
    steps: list[str]
    z_steps: list[list[float]]


class Run(BaseModel):
    training: list[EpochMetrics]
    latent_space: list[LatentPoint]
    reconstructions: list[Reconstruction]
    interpolations: list[Interpolation]
    samples: list[str]
