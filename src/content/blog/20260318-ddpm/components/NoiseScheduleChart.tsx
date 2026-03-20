import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import ChartCard from '@/components/charts/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/react/chart';

import run from '../run.json';

const config = {
  beta: { label: 'βₜ', color: 'var(--chart-1)' },
  alpha_bar: { label: 'ᾱₜ', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const data = run.noise_schedule.t.map((t, i) => ({
  t,
  beta: run.noise_schedule.beta[i],
  alpha_bar: run.noise_schedule.alpha_bar[i],
}));

export default function NoiseScheduleChart() {
  return (
    <ChartCard
      title="Cosine noise schedule"
      description="β and cumulative ᾱ over 1000 timesteps"
      className="my-8"
    >
      <ChartContainer config={config} className="min-h-[300px] w-full">
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            orientation="left"
            tickFormatter={(v) => v.toFixed(3)}
          />
          <YAxis
            yAxisId="right"
            tickLine={false}
            axisLine={false}
            orientation="right"
            domain={[0, 1]}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="beta"
            stroke="var(--color-beta)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="alpha_bar"
            stroke="var(--color-alpha_bar)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
