import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import ChartCard from '@/components/charts/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import run from '../run.json';

const config = {
  mse: { label: 'MSE loss', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export default function TrainingCurves() {
  return (
    <ChartCard title="Training loss" description="MSE over 150 epochs" className="my-8">
      <ChartContainer config={config} className="min-h-[300px] w-full">
        <LineChart data={run.training} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="epoch"
            type="number"
            domain={[0, 150]}
            ticks={[0, 30, 60, 90, 120, 150]}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Epoch',
              position: 'insideBottom',
              offset: -2,
              style: { fontSize: 12 },
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            scale="log"
            domain={['auto', 'auto']}
            tickFormatter={(v) => (v < 0.01 ? v.toExponential(0) : v.toFixed(3))}
            label={{
              value: 'MSE loss',
              angle: -90,
              position: 'insideLeft',
              offset: -5,
              style: { fontSize: 12 },
            }}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Line
            type="monotone"
            dataKey="mse"
            stroke="var(--color-mse)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
