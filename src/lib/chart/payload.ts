/**
 * What each chart serializes into its `data-payload` attribute for its hover script.
 * Positions are fractions of the plot, 0 at the left or top and 1 at the right or bottom.
 */

export interface LinePayload {
  titles: string[];
  x: number[];
  series: { label: string; color: string; values: string[]; y: number[] }[];
}

export interface ScatterPayload {
  points: [x: number, y: number, color: string, title: string, detail: string, note: string][];
  charColors: Record<string, string>;
}
