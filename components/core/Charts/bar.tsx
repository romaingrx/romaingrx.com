import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import ChartWrapper from './wrapper';

interface BarChartProps {
  title?: string;
  description?: string;
  data: Array<{ name: string; value: number }>;
  xAxisLabel: string;
  yAxisLabel: string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  width?: string | number;
  height?: number;
  layout?: 'vertical' | 'horizontal';
  barColor?: string;
}

export default function BarChart({
  title,
  description,
  data,
  xAxisLabel,
  yAxisLabel,
  margin = { top: 0, right: 20, bottom: 50, left: 40 },
  width = '100%',
  height = 400,
  layout = 'vertical',
  barColor = '#8884d8',
}: BarChartProps) {
  return (
    <ChartWrapper title={title} description={description}>
      <ResponsiveContainer
        width={width}
        height={height}
        className={'overflow-visible p-4'}
      >
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={margin}
          className={'overflow-visible'}
          id="bar-chart"
          style={{
            overflow: 'visible',
            padding: '10px',
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            id="x-axis"
            type={layout === 'vertical' ? 'number' : 'category'}
            dataKey={layout === 'vertical' ? 'value' : 'name'}
            tick={{ fill: '#888', fontSize: 12 }}
            axisLine={{ stroke: '#888' }}
            label={{
              value: xAxisLabel,
              position: 'bottom',
              fill: '#888',
              dy: 30,
            }}
          />
          <YAxis
            id="y-axis"
            type={layout === 'vertical' ? 'category' : 'number'}
            dataKey={layout === 'vertical' ? 'name' : 'value'}
            tick={{ fill: '#888' }}
            axisLine={{ stroke: '#888' }}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              fill: '#888',
              dx: -30,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--romaingrx-card-background-color)',
              border: '',
              borderRadius: '4px',
            }}
            cursor={false}
          />
          <Bar
            id="bar"
            dataKey="value"
            fill={barColor}
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
            label={{ position: 'right', fill: '#888' }}
            colorProfile={'d'}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
