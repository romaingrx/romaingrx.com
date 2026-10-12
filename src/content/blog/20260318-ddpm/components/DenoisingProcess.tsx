import type Run from '../run.json';

import { StepSlider } from '@/components/blog/components/step-slider';

import picked from '../run.json?key=denoising&pick';

// Only this island's slice of run.json ships with it.
const denoising = picked as (typeof Run)['denoising'];

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
