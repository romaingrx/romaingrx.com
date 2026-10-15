/** Build-time scales and ticks for the SVG charts. Positions are fractions in [0, 1]. */

export type ScaleType = 'linear' | 'log';

export interface Scale {
  domain: [number, number];
  ticks: number[];
  /** Maps a value to its position along the axis, 0 at the start and 1 at the end. */
  at: (v: number) => number;
}

function niceStep(span: number, count: number) {
  const raw = span / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const err = raw / pow;
  return (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * pow;
}

/** Evenly spaced round ticks covering [min, max], like d3's nice(). */
export function linearTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return [min];
  const step = niceStep(max - min, count);
  const ticks: number[] = [];
  const end = Math.ceil(max / step) * step;
  for (let v = Math.floor(min / step) * step; v <= end + step * 1e-9; v += step) {
    ticks.push(Number(v.toPrecision(12)));
  }
  return ticks;
}

/** 1-2-5 ticks for each decade between min and max. */
export function logTicks(min: number, max: number): number[] {
  const ticks: number[] = [];
  for (let e = Math.floor(Math.log10(min)); e <= Math.ceil(Math.log10(max)); e++) {
    for (const m of [1, 2, 5]) {
      const v = Number((m * 10 ** e).toPrecision(12));
      if (v >= min && v <= max) ticks.push(v);
    }
  }
  return ticks;
}

export function scale(
  values: number[],
  {
    type = 'linear',
    domain,
    ticks,
  }: { type?: ScaleType; domain?: [number, number]; ticks?: number[] } = {},
): Scale {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (type === 'log') {
    const d = domain ?? [min, max];
    const [l0, l1] = [Math.log10(d[0]), Math.log10(d[1])];
    return {
      domain: d,
      ticks: ticks ?? logTicks(d[0], d[1]),
      at: (v) => (Math.log10(v) - l0) / (l1 - l0),
    };
  }
  let d = domain;
  let t = ticks;
  if (!d) {
    t ??= linearTicks(min, max);
    d = [Math.min(t[0], min), Math.max(t[t.length - 1], max)];
  }
  t ??= linearTicks(d[0], d[1]);
  const [d0, d1] = d;
  return { domain: d, ticks: t, at: (v) => (v - d0) / (d1 - d0) };
}

/** Rounds a fraction for compact output in HTML attributes. */
export const r = (v: number) => Math.round(v * 1e4) / 1e4;

/** Plots draw in a fixed 0..VIEW box that is stretched to the plot area. */
export const VIEW = 1000;

/** A fraction in [0, 1] as a coordinate in the plot's view box. */
export const toView = (f: number) => r(f * VIEW);

/** A fraction in [0, 1] as a CSS percentage. */
export const pct = (f: number) => `${r(f * 100)}%`;
