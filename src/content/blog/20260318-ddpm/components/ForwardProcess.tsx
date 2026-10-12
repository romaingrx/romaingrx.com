import type Run from '../run.json';

import { StepSlider } from '@/components/blog/components/step-slider';

import picked from '../run.json?key=forward_process&pick';

// Only this island's slice of run.json ships with it.
const forward_process = picked as (typeof Run)['forward_process'];

const examples = forward_process.map((ex, i) => ({
  label: `${i + 1}`,
  steps: ex.steps,
}));

export default function ForwardProcess() {
  return (
    <StepSlider
      mode="examples"
      examples={examples}
      title="Forward process"
      description="Adding noise to font glyphs"
      size={64}
      className="my-8"
    />
  );
}
