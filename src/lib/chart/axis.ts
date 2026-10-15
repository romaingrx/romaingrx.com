import { formatSignificant } from '@/lib/format';

import { scale, type Scale, type ScaleType } from './scale';

export interface AxisConfig {
  label?: string;
  type?: ScaleType;
  domain?: [number, number];
  ticks?: number[];
  format?: (v: number) => string;
}

export interface Axis {
  scale: Scale;
  format: (v: number) => string;
  label?: string;
}

export function axis(values: number[], config: AxisConfig = {}): Axis {
  return {
    scale: scale(values, config),
    format: config.format ?? formatSignificant,
    label: config.label,
  };
}
