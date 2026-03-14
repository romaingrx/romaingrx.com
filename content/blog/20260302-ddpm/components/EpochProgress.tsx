'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import run from '../run.json';

const entries = run.training_samples;

export default function EpochProgress() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = entries[index];

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
      setIndex((prev) => {
        if (prev >= entries.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    return clearTimer;
  }, [playing, clearTimer]);

  const togglePlay = () => setPlaying((p) => !p);

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Learning to write</CardTitle>
        <CardDescription>Validation samples across training</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {current.images.map((img, i) => (
            <div key={i} className="rounded bg-black p-1 flex items-center justify-center">
              <img
                src={`data:image/png;base64,${img}`}
                alt={`Epoch ${current.epoch + 1} sample ${i + 1}`}
                width={128}
                height={128}
                style={{
                  width: 128,
                  height: 128,
                  imageRendering: 'pixelated',
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="flex-shrink-0 rounded p-1.5 hover:bg-muted transition-colors"
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
            max={entries.length - 1}
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              setPlaying(false);
            }}
            className="w-full accent-primary"
          />
        </div>

        <span className="text-xs font-mono text-muted-foreground">epoch {current.epoch + 1}</span>
      </CardContent>
    </Card>
  );
}
