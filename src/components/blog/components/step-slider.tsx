'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Step {
  t: number;
  image: string;
}

interface Example {
  label: string;
  steps: Step[];
}

interface StepSliderProps {
  steps?: Step[];
  examples?: Example[];
  title?: string;
  description?: string | ((label: string) => string);
  size?: number;
  className?: string;
  autoPlay?: boolean;
  intervalMs?: number;
}

export function StepSlider({
  steps: singleSteps,
  examples,
  title,
  description,
  size = 64,
  className,
  autoPlay = false,
  intervalMs = 200,
}: StepSliderProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allExamples: Example[] = examples ?? [{ label: '', steps: singleSteps ?? [] }];
  const hasTabs = allExamples.length > 1;
  const steps = allExamples[activeIdx].steps;
  const current = steps[stepIdx];
  const renderSize = size * 4;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!playing) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % steps.length);
    }, intervalMs);
    return clearTimer;
  }, [playing, intervalMs, steps.length, clearTimer]);

  const togglePlay = () => setPlaying((p) => !p);

  const switchExample = (idx: number) => {
    setActiveIdx(idx);
    setStepIdx(0);
    setPlaying(false);
  };

  const descText =
    typeof description === 'function' ? description(allExamples[activeIdx].label) : description;

  if (!current) return null;

  return (
    <Card className={cn(className)}>
      {(title || descText || hasTabs) && (
        <CardHeader>
          <div className={cn(hasTabs && 'flex items-center justify-between')}>
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {descText && <CardDescription>{descText}</CardDescription>}
            </div>
            {hasTabs && (
              <div className="flex items-center gap-2">
                {allExamples.map((ex, i) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => switchExample(i)}
                    className={cn(
                      'rounded-full px-3 py-1 font-mono text-sm transition-colors',
                      i === activeIdx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center rounded bg-card">
          <img
            src={`data:image/png;base64,${current.image}`}
            alt={`Step t=${current.t}`}
            width={renderSize}
            height={renderSize}
            style={{
              width: renderSize,
              height: renderSize,
              imageRendering: 'pixelated',
            }}
          />
        </div>

        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="flex-shrink-0 rounded p-1.5 transition-colors hover:bg-muted"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={stepIdx}
            onChange={(e) => {
              setStepIdx(Number(e.target.value));
              setPlaying(false);
            }}
            className="w-full accent-primary"
          />
        </div>

        <span className="font-mono text-xs text-muted-foreground">t = {current.t}</span>
      </CardContent>
    </Card>
  );
}
