import { find } from './dom';
import { tooltipBox, type Tooltip } from './tooltip';

/** The pointer inside the plot, as fractions of its size, with the size in pixels. */
export interface Pointer {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HoverContext<T> {
  plot: HTMLElement;
  data: T;
  tip: Tooltip;
}

export interface HoverHandlers {
  move: (pointer: Pointer) => void;
  /** Hides the chart's own overlays. The tooltip hides itself. */
  leave: () => void;
}

/**
 * Wires the pointer events of every chart of one `kind` on the page. A chart type only
 * says what to show for a pointer position.
 */
export function bindHover<T>(kind: string, setup: (ctx: HoverContext<T>) => HoverHandlers) {
  for (const root of document.querySelectorAll<HTMLElement>(`[data-chart="${kind}"]`)) {
    const plot = find(root, '[data-plot]');
    const payload = root.dataset.payload;
    if (!payload) throw new Error(`A ${kind} chart has no data-payload.`);
    const tip = tooltipBox(plot);
    const handlers = setup({ plot, data: JSON.parse(payload) as T, tip });

    plot.addEventListener('pointermove', (e) => {
      const box = plot.getBoundingClientRect();
      handlers.move({
        x: (e.clientX - box.left) / box.width,
        y: (e.clientY - box.top) / box.height,
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
