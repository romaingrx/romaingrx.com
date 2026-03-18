import { StepSlider } from '@/components/blog/components/step-slider';
import run from '../run.json';

const examples = run.forward_process.map((ex, i) => ({
  label: `${i + 1}`,
  steps: ex.steps,
}));

export default function ForwardProcess() {
  return (
    <StepSlider
      examples={examples}
      title="Forward process"
      description="Adding noise to font glyphs"
      size={64}
      className="my-8"
    />
  );
}
