import { toString as utilToString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkReadingTime() {
  return (tree, { data }) => {
    // Skip MDX import/export blocks: they are code, not reading material.
    const prose = { ...tree, children: tree.children.filter((node) => node.type !== 'mdxjsEsm') };
    const textOnPage = utilToString(prose);
    const readingTime = getReadingTime(textOnPage);
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
