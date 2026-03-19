import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="flex items-center justify-center gap-4">
          {stages.map((stage, i) => (
            <div key={i} className="flex items-center gap-4">
              {i > 0 && <span className="text-2xl text-muted-foreground">→</span>}
              <div className="flex flex-col items-center gap-2">
                <div className="rounded bg-black p-1 flex items-center justify-center">
                  <img
                    src={`data:image/png;base64,${stage.image}`}
                    alt={stage.label}
                    width={96}
                    height={96}
                    style={{ width: 96, height: 96, imageRendering: 'pixelated' }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-mono">{stage.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
