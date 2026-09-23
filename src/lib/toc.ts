import type { MarkdownHeading } from 'astro';

export type Heading = MarkdownHeading & {
  subheadings: Heading[];
};

export function buildToc(headings: MarkdownHeading[]): Heading[] {
  const toc: Heading[] = [];
  const parents: Heading[] = [];

  for (const heading of headings) {
    const newHeading: Heading = { ...heading, subheadings: [] };

    while (parents.length > 0 && parents[parents.length - 1].depth >= newHeading.depth) {
      parents.pop();
    }

    const parent = parents[parents.length - 1];
    if (parent) {
      parent.subheadings.push(newHeading);
    } else {
      toc.push(newHeading);
    }

    parents.push(newHeading);
  }

  return toc;
}
