import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import ChartCard from '@/components/charts/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  asr: {
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--chart-1-foreground))',
  },
} satisfies ChartConfig;

const chartData = [
  { asr: '0.3475', name: 'baichuan2_7b' },
  { asr: '0.265', name: 'koala_7b' },
  { asr: '0.0125', name: 'llama2_7b' },
  { asr: '0.3675', name: 'mistral_7b_v2' },
  { asr: '0.3825', name: 'openchat_3_5_1210' },
  { asr: '0.315', name: 'orca_2_7b' },
  { asr: '0.2325', name: 'qwen_7b_chat' },
  { asr: '0.365', name: 'solar_10_7b_instruct' },
  { asr: '0.4225', name: 'starling_7b' },
  { asr: '0.3425', name: 'vicuna_7b_v1_5' },
  { asr: '0.41', name: 'zephyr_7b' },
];

export default function ASRChart() {
  return (
    <ChartCard
      title="Attack success rate"
      description="ASR performance of the trained model across various models in HarmBench, evaluated using all functional categories"
      className="my-4"
    >
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            right: 16,
          }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <XAxis dataKey="asr" type="number" hide />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Bar dataKey="asr" layout="vertical" fill="var(--color-asr)" radius={4}>
            <LabelList dataKey="name" position="insideLeft" offset={8} fontSize={12} />
            <LabelList dataKey="asr" position="right" offset={8} fontSize={12} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
