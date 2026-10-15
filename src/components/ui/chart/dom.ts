export function el(tag: string, className: string, text?: string) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function find(root: ParentNode, selector: string) {
  const node = root.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Chart is missing ${selector}.`);
  return node;
}

export function toggle(node: HTMLElement, visible: boolean) {
  node.classList.toggle('hidden', !visible);
}
