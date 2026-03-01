import { useMemo } from 'react';
import { CartesianGrid, Cell, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '@/components/charts/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import run from '../run.json';

const config = {
  z: { label: 'Latent point', color: 'var(--chart-1)' },
} satisfies ChartConfig;

function seqColor(seq: string): string {
  let hash = 0;
  for (let i = 0; i < Math.min(seq.length, 10); i++) {
    hash = seq.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = 240 + (((hash % 80) + 80) % 80); // 240-320: purple to magenta
  const lightness = 40 + ((((hash >> 8) % 25) + 25) % 25); // 40-65%
  return `hsl(${hue}, 55%, ${lightness}%)`;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const { x, y, sequence } = payload[0].payload;
  return (
    <div className="bg-background border-border rounded-lg border p-3 shadow-xl">
      <div className="text-muted-foreground mb-1 text-xs font-medium">
        z = [{x.toFixed(2)}, {y.toFixed(2)}]
      </div>
      <div className="max-w-[280px] break-all font-mono text-xs leading-relaxed">
        {sequence.split('').map((aa: string, i: number) => (
          <span key={i} className="inline-block" style={{ color: seqColor(aa) }}>
            {aa}
          </span>
        ))}
      </div>
      <div className="text-muted-foreground mt-1 text-xs">{sequence.length} residues</div>
    </div>
  );
}

export default function LatentSpace() {
  const data = useMemo(
    () => run.latent_space.map((p) => ({ x: p.z[0], y: p.z[1], sequence: p.sequence })),
    []
  );

  return (
    <ChartCard
      title="Latent space"
      description="Each protein sequence encoded as a 2D point. Hover to inspect."
      className="my-4"
    >
      <ChartContainer config={config} className="min-h-[400px] w-full">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="z₁" tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey="y" name="z₂" tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={false} isAnimationActive={false} />
          <Scatter data={data} isAnimationActive={false}>
            {data.map((point, i) => (
              <Cell key={i} fill={seqColor(point.sequence)} fillOpacity={0.7} r={3} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  );
}
