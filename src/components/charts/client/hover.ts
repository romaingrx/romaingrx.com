import { tooltipBox, type Tooltip } from './tooltip';

/** The pointer position inside the plot, in pixels, with the plot's size. */
export interface Pointer {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HoverContext<T> {
  root: HTMLElement;
  plot: HTMLElement;
  data: T;
  tip: Tooltip;
}

export interface HoverHandlers {
  move: (pointer: Pointer) => void;
  /** Hides the chart's own overlays; the tooltip is hidden for you. */
  leave: () => void;
}

/**
 * Wires pointer events for every chart of one `kind` on the page. Each chart type only
 * supplies what to show for a pointer position; parsing, events and the tooltip are shared.
 */
export function bindHover<T>(kind: string, setup: (ctx: HoverContext<T>) => HoverHandlers) {
  for (const root of document.querySelectorAll<HTMLElement>(`[data-chart="${kind}"]`)) {
    const plot = root.querySelector<HTMLElement>('[data-plot]');
    if (!plot || !root.dataset.payload) continue;
    const tip = tooltipBox(plot);
    const handlers = setup({ root, plot, data: JSON.parse(root.dataset.payload) as T, tip });

    plot.addEventListener('pointermove', (e) => {
      const box = plot.getBoundingClientRect();
      handlers.move({
        x: e.clientX - box.left,
        y: e.clientY - box.top,
        width: box.width,
        height: box.height,
      });
    });
    plot.addEventListener('pointerleave', () => {
      tip.hide();
      handlers.leave();
    });
  }
}
