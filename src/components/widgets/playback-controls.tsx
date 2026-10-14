import type { usePlayback } from './use-playback';

import { Button } from '@/components/ui/button/button';

type Playback = ReturnType<typeof usePlayback>;

interface PlaybackControlsProps {
  playback: Playback;
  count: number;
  /** Noun for one frame, used in the button labels (e.g. "timestep", "epoch"). */
  unit: string;
  sliderLabel: string;
  valueText: string;
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const PlayIcon = () => (
  <svg {...iconProps}>
    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
  </svg>
);

const PauseIcon = () => (
  <svg {...iconProps}>
    <rect width="5" height="18" x="14" y="3" rx="1" />
    <rect width="5" height="18" x="5" y="3" rx="1" />
  </svg>
);

const ReplayIcon = () => (
  <svg {...iconProps}>
    <path d="M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

/** Play/pause button and scrubber shared by the step-by-step widgets. */
export function PlaybackControls({
  playback,
  count,
  unit,
  sliderLabel,
  valueText,
}: PlaybackControlsProps) {
  const atEnd = playback.index === count - 1;
  const label = playback.playing
    ? 'Pause playback'
    : atEnd
      ? `Replay from first ${unit}`
      : `Play ${unit}s`;

  return (
    <div className="flex w-full items-center gap-3" data-pagefind-ignore>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={label}
        onClick={playback.toggle}
      >
        {playback.playing ? <PauseIcon /> : atEnd ? <ReplayIcon /> : <PlayIcon />}
      </Button>
      <input
        type="range"
        min={0}
        max={count - 1}
        value={playback.index}
        aria-label={sliderLabel}
        aria-valuetext={valueText}
        onChange={(event) => playback.seek(Number(event.target.value))}
        className="h-11 w-full accent-primary"
      />
    </div>
  );
}
