import type { MarkdownHeading } from 'astro';

export type Heading = MarkdownHeading & {
  subheadings: Heading[];
};

export function buildToc(headings: MarkdownHeading[]): Heading[] {
  const toc: Heading[] = [];
  const parents = new Map<number, Heading>();

  for (const heading of headings) {
    const newHeading: Heading = { ...heading, subheadings: [] };

    if (newHeading.depth === 1) {
      toc.push(newHeading);
    } else {
      const parent = parents.get(newHeading.depth - 1);
      if (parent) {
        parent.subheadings.push(newHeading);
      }
    }

    parents.set(newHeading.depth, newHeading);
  }
  return toc;
}
