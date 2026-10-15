'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/card';
import { cn } from '@/lib/utils';

import { PlaybackControls } from './playback-controls';
import { usePlayback } from './use-playback';

export interface Step {
  t: number;
  image: string;
}

export interface Example {
  label: string;
  steps: Step[];
}

type SharedProps = {
  title?: string;
  description?: string | ((label: string) => string);
  size?: number;
  className?: string;
  autoPlay?: boolean;
  intervalMs?: number;
};

export type StepSliderProps = SharedProps &
  ({ mode: 'steps'; steps: Step[] } | { mode: 'examples'; examples: Example[] });

export function StepSlider(props: StepSliderProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const examples = props.mode === 'examples' ? props.examples : [{ label: '', steps: props.steps }];
  const activeExample = examples[activeIdx];
  const steps = activeExample?.steps ?? [];
  const playback = usePlayback({
    count: steps.length,
    intervalMs: props.intervalMs ?? 200,
    autoPlay: props.autoPlay,
  });
  const current = steps[playback.index];
  const hasTabs = examples.length > 1;
  const descText =
    typeof props.description === 'function'
      ? props.description(activeExample?.label ?? '')
      : props.description;
  const renderSize = (props.size ?? 64) * 4;

  const switchExample = (index: number) => {
    if (index === activeIdx) return;
    setActiveIdx(index);
    playback.seek(0);
  };

  return (
    <Card className={cn(props.className)}>
      {(props.title || descText || hasTabs) && (
        <CardHeader>
          <div
            className={cn(
              hasTabs && 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
            )}
          >
            <div>
              {props.title && <CardTitle>{props.title}</CardTitle>}
              {descText && <CardDescription>{descText}</CardDescription>}
            </div>
            {hasTabs && (
              <div className="flex flex-wrap gap-2" data-pagefind-ignore>
                {examples.map((example, index) => (
                  <Button
                    // oxlint-disable-next-line react/no-array-index-key -- labels are optional, and the list never reorders
                    key={`${example.label}-${index}`}
                    type="button"
                    variant={index === activeIdx ? 'default' : 'secondary'}
                    size="sm"
                    aria-pressed={index === activeIdx}
                    onClick={() => switchExample(index)}
                  >
                    {example.label || `Example ${index + 1}`}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="flex flex-col items-center gap-4">
        {current ? (
          <div
            className="flex aspect-square w-full items-center justify-center overflow-hidden rounded bg-card"
            style={{ maxWidth: renderSize }}
            data-pagefind-ignore
          >
            <img
              src={`data:image/png;base64,${current.image}`}
              alt={`Timestep t = ${current.t}`}
              width={renderSize}
              height={renderSize}
              style={{
                width: '100%',
                height: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
          </div>
        ) : (
          <p role="status" className="text-sm text-muted-foreground">
            No steps are available for this example.
          </p>
        )}

        {steps.length > 1 && current ? (
          <PlaybackControls
            playback={playback}
            count={steps.length}
            unit="timestep"
            sliderLabel={`${props.title ?? 'Process'} timestep`}
            valueText={`timestep ${current.t}; step ${playback.index + 1} of ${steps.length}`}
          />
        ) : current ? (
          <p className="text-sm text-muted-foreground" data-pagefind-ignore>
            Only timestep t = {current.t} is available.
          </p>
        ) : null}

        {current && steps.length > 1 && (
          <output className="font-mono text-xs text-muted-foreground" data-pagefind-ignore>
            Step {playback.index + 1} of {steps.length} · t = {current.t}
          </output>
        )}
      </CardContent>
    </Card>
  );
}
