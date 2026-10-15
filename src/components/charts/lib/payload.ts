/**
 * Data each chart serializes into its `data-payload` attribute for its hover script.
 * Positions are fractions of the plot, 0 at the left or top and 1 at the right or bottom.
 */

export interface LinePayload {
  /** Tooltip heading per x. */
  titles: string[];
  /** Horizontal position per x. */
  x: number[];
  series: { label: string; color: string; values: string[]; y: number[] }[];
}

export interface ScatterPayload {
  points: [x: number, y: number, color: string, title: string, detail: string, note: string][];
  /** Per-character colors for each point's `detail`. */
  charColors: Record<string, string>;
}

export const encode = (payload: LinePayload | ScatterPayload) => JSON.stringify(payload);
