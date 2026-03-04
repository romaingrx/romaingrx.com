from pydantic import BaseModel


class EpochMetrics(BaseModel):
    epoch: int
    loss: float
    mse: float


class NoiseScheduleData(BaseModel):
    t: list[int]
    beta: list[float]
    alpha: list[float]
    alpha_bar: list[float]


class ForwardProcessStep(BaseModel):
    t: int
    image: str


class ForwardProcessExample(BaseModel):
    original: str
    steps: list[ForwardProcessStep]


class DenoisingStep(BaseModel):
    t: int
    image: str


class DenoisingExample(BaseModel):
    steps: list[DenoisingStep]


class Sample(BaseModel):
    image: str


class TrainingSample(BaseModel):
    epoch: int
    images: list[str]


class Run(BaseModel):
    training: list[EpochMetrics]
    training_samples: list[TrainingSample]
    noise_schedule: NoiseScheduleData
    forward_process: list[ForwardProcessExample]
    denoising: list[DenoisingExample]
    samples: list[Sample]
