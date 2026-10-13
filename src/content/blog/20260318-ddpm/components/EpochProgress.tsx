'use client';

import { PlaybackControls } from '@/components/blog/components/playback-controls';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/card';
import { usePlayback } from '@/hooks/use-playback';

import training_samples from '../data/training_samples.json';

const entries = training_samples;

export default function EpochProgress() {
  const playback = usePlayback({ count: entries.length, intervalMs: 500 });
  const current = entries[playback.index];

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Learning to write</CardTitle>
        <CardDescription>Validation samples across training</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {current ? (
          <div
            className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-2 sm:flex sm:flex-wrap sm:justify-center"
            data-pagefind-ignore
          >
            {current.images.map((image, index) => (
              // oxlint-disable-next-line react/no-array-index-key -- static image list per epoch
              <div
                key={`${current.epoch}-${index}`}
                className="flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded bg-black sm:size-32"
              >
                <img
                  src={`data:image/png;base64,${image}`}
                  alt={`Epoch ${current.epoch + 1} sample ${index + 1}`}
                  width={128}
                  height={128}
                  className="box-border aspect-square object-contain p-1"
                  style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p role="status" className="text-sm text-muted-foreground">
            No validation samples are available.
          </p>
        )}

        {entries.length > 1 && current ? (
          <PlaybackControls
            playback={playback}
            count={entries.length}
            unit="epoch"
            sliderLabel="Training epoch"
            valueText={`epoch ${current.epoch + 1}; validation sample ${playback.index + 1} of ${entries.length}`}
          />
        ) : current ? (
          <p className="text-sm text-muted-foreground" data-pagefind-ignore>
            Only epoch {current.epoch + 1} is available.
          </p>
        ) : null}

        {current && entries.length > 1 && (
          <output className="font-mono text-xs text-muted-foreground" data-pagefind-ignore>
            Epoch {current.epoch + 1} · validation sample {playback.index + 1} of {entries.length}
          </output>
        )}
      </CardContent>
    </Card>
  );
}
