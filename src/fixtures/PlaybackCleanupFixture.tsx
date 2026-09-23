import { useState } from 'react';

import { StepSlider } from '@/components/blog/components/step-slider';

const image =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/9TsAAAAASUVORK5CYII=';

const steps = [
  { t: 0, image },
  { t: 1, image },
];

export default function PlaybackCleanupFixture() {
  const [mounted, setMounted] = useState(true);

  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setMounted(false)}>
        Unmount timer fixture
      </button>
      {mounted && (
        <StepSlider
          mode="steps"
          steps={steps}
          title="Timer cleanup"
          intervalMs={60_000}
          size={24}
        />
      )}
    </div>
  );
}
