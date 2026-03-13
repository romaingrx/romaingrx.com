import { StepSlider } from '@/components/blog/components/step-slider';
import run from '../run.json';

const examples = run.denoising.slice(0, 3).map((ex) => ({
  label: ex.letter,
  steps: ex.steps,
}));

export default function DenoisingProcess() {
  return (
    <StepSlider
      examples={examples}
      title="Reverse process"
      description={(letter) => `Denoising "${letter}" from pure noise`}
      size={64}
      className="my-8"
    />
  );
}
