import { StepSlider } from '@/components/blog/components/step-slider';

import forward_process from '../data/forward_process.json';

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
