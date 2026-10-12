import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/react/card';

import run from '../run.json';

const example = run.forward_process[0];
// original = thresholded binary glyph; steps[0] at t=0 ≈ clean SDF field
const binary = example.original;
const sdfField = example.steps[0].image;

const stages = [
  { label: 'Binary glyph', image: binary },
  { label: 'Signed Distance Field', image: sdfField },
  { label: 'Thresholded output', image: binary },
] as const;

export default function SDFPipeline() {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>SDF pipeline</CardTitle>
        <CardDescription>Binary → distance field → thresholded back to crisp edges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {stages.map((stage, i) => (
            <div
              key={stage.label}
              className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
            >
              {i > 0 && (
                <span className="text-2xl text-muted-foreground sm:hidden" aria-hidden="true">
                  ↓
                </span>
              )}
              {i > 0 && (
                <span
                  className="hidden text-2xl text-muted-foreground sm:inline"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
              <div className="flex flex-col items-center gap-2">
                <div className="flex aspect-square size-24 items-center justify-center overflow-hidden rounded bg-black p-1">
                  <img
                    src={`data:image/png;base64,${stage.image}`}
                    alt={stage.label}
                    width={96}
                    height={96}
                    className="aspect-square object-contain"
                    style={{
                      width: '100%',
                      height: '100%',
                      aspectRatio: '1 / 1',
                      imageRendering: 'pixelated',
                    }}
                  />
                </div>
                <span className="text-center font-mono text-xs text-muted-foreground">
                  {stage.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
