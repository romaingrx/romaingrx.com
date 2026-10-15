import { scale, type Scale, type ScaleType } from './scale';

/** Default number format: up to four significant digits, no trailing zeros. */
export const fmt = (v: number) => String(Number(v.toPrecision(4)));

/** What a chart's caller can say about one of its axes. */
export interface AxisConfig {
  label?: string;
  type?: ScaleType;
  domain?: [number, number];
  ticks?: number[];
  format?: (v: number) => string;
}

/** A resolved axis, ready for the plot frame to draw. */
export interface Axis {
  scale: Scale;
  format: (v: number) => string;
  label?: string;
}

/** Builds an axis over `values`, filling in the default scale and format. */
export function axis(values: number[], config: AxisConfig = {}): Axis {
  return {
    scale: scale(values, config),
    format: config.format ?? fmt,
    label: config.label,
  };
}
