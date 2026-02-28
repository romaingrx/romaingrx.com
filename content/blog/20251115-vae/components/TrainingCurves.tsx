import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import ChartCard from '@/components/charts/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import run from '../run.json';

const config = {
  recon: { label: 'Reconstruction', color: 'var(--chart-1)' },
  kl: { label: 'KL divergence', color: 'var(--chart-2)' },
  loss: { label: 'Total loss', color: 'var(--chart-3)' },
} satisfies ChartConfig;

export default function TrainingCurves() {
  return (
    <ChartCard
      title="Training curves"
      description="Loss decomposition over 200 epochs with KL annealing (first 50 epochs)"
      className="my-4"
    >
      <ChartContainer config={config} className="min-h-[300px] w-full">
        <LineChart data={run.training} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="epoch"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v % 50 === 0 ? `${v}` : '')}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="recon"
            stroke="var(--color-recon)"
            strokeWidth={2}
            dot={false}
          />
          <Line type="monotone" dataKey="kl" stroke="var(--color-kl)" strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey="loss"
            stroke="var(--color-loss)"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
