import { StepSlider } from '@/components/widgets/step-slider';

import denoising from '../data/denoising.json';

const examples = denoising.slice(0, 3).map((ex) => ({
  label: ex.letter,
  steps: ex.steps,
}));

export default function DenoisingProcess() {
  return (
    <StepSlider
      mode="examples"
      examples={examples}
      title="Reverse process"
      description={(letter) => `Denoising "${letter}" from pure noise`}
      size={64}
      className="my-8"
    />
  );
}
