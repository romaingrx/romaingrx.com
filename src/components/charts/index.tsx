import * as React from 'react';
import * as Recharts from 'recharts';

import { ChartContainer, type ChartConfig } from '../ui/chart';
import ChartCard, { type ChartCardProps } from './card';

interface ChartProps extends ChartCardProps {
  config: ChartConfig;
  children: React.ComponentProps<typeof Recharts.ResponsiveContainer>['children'];
}

export default function Chart({ config, children, ...props }: ChartProps) {
  return (
    <ChartCard {...props}>
      <ChartContainer config={config}>{children}</ChartContainer>
    </ChartCard>
  );
}
