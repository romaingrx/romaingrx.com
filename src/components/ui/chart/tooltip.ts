import { el, find, toggle } from './dom';

export function heading(text: string) {
  return el('div', 'mb-1 font-medium', text);
}

export function note(text: string) {
  return el('div', 'mt-1 text-muted-foreground', text);
}

export function row(color: string, label: string, value: string) {
  const line = el('div', 'flex items-center gap-2');
  const swatch = el('span', 'size-2 shrink-0 rounded-[2px]');
  swatch.style.background = color;
  line.append(
    swatch,
    el('span', 'text-muted-foreground', label),
    el('span', 'ml-auto pl-3 font-mono font-medium tabular-nums', value),
  );
  return line;
}

/** Monospace text with a color per character, e.g. a protein sequence. */
export function colored(text: string, colors: Record<string, string>) {
  const body = el('div', 'max-w-[min(280px,70vw)] font-mono leading-relaxed break-all');
  for (const ch of text) {
    const span = el('span', '', ch);
    if (colors[ch]) span.style.color = colors[ch];
    body.append(span);
  }
  return body;
}

export type Tooltip = ReturnType<typeof tooltipBox>;

export function tooltipBox(plot: HTMLElement) {
  const tip = find(plot, '[data-tip]');
  return {
    /** Places the tooltip next to an anchor given as fractions of the plot, kept inside the plot. */
    show(content: Node[], x: number, y: number) {
      tip.replaceChildren(...content);
      toggle(tip, true);
      const [w, h] = [plot.clientWidth, plot.clientHeight];
      const [tw, th] = [tip.offsetWidth, tip.offsetHeight];
      const [ax, ay] = [x * w, y * h];
      // Beside the point when it fits; on narrow screens, above or below it instead.
      let left = ax + 12 + tw <= w ? ax + 12 : ax - 12 - tw;
      let top = ay - th / 2;
      if (left < 0) {
        left = Math.max(0, Math.min(ax - tw / 2, w - tw));
        top = ay - th - 12 >= 0 ? ay - th - 12 : ay + 12;
      }
      tip.style.left = `${left}px`;
      tip.style.top = `${Math.min(Math.max(top, 0), h - th)}px`;
    },
    hide() {
      toggle(tip, false);
    },
  };
}
