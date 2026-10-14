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
      const flip = x > 0.5;
      tip.style.left = `${x * 100}%`;
      tip.style.top = `${Math.min(Math.max(y - tip.offsetHeight / 2, 0), plot.clientHeight - tip.offsetHeight)}px`;
      tip.style.transform = flip ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)';
    },
    hide() {
      tip.classList.add('hidden');
    },
  };
}
