/** Hover tooltip shared by the chart scripts: positions the plot's `[data-tip]` box. */

function el(tag: string, className: string, text?: string) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function heading(text: string) {
  return el('div', 'mb-1 font-medium', text);
}

/** A legend swatch, label and right-aligned value, like the old Recharts tooltip rows. */
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

export function tooltipBox(plot: HTMLElement) {
  const tip = plot.querySelector<HTMLElement>('[data-tip]')!;
  return {
    /** `x` is the anchor as a fraction of the plot width, `y` the pointer offset in pixels. */
    show(content: Node[], x: number, y: number) {
      tip.replaceChildren(...content);
      tip.classList.remove('hidden');
      const [w, h] = [plot.clientWidth, plot.clientHeight];
      const [tw, th] = [tip.offsetWidth, tip.offsetHeight];
      const ax = x * w;
      // Beside the point when it fits, otherwise clamped inside the plot above or below it.
      let left = ax + 12 + tw <= w ? ax + 12 : ax - 12 - tw;
      let top = y - th / 2;
      if (left < 0) {
        left = Math.max(0, Math.min(ax - tw / 2, w - tw));
        top = y - th - 12 >= 0 ? y - th - 12 : y + 12;
      }
      tip.style.left = `${left}px`;
      tip.style.top = `${Math.min(Math.max(top, 0), h - th)}px`;
    },
    hide() {
      tip.classList.add('hidden');
    },
  };
}
