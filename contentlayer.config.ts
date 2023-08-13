import { makeSource } from 'contentlayer/source-files';
import Article from './content/definitions/Article';

import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkSourceRedirect from './content/plugins/remarkSourceRedirect';

const PrettyCodeOptions: Partial<Options> = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node: any) {
    const nodeClass = node.properties.className;
    if (nodeClass && nodeClass.length > 0) {
      node.properties.className.push('highlighted');
    } else {
      node.properties.className = ['highlighted'];
    }
  },

  // onVisitHighlightedWord(node: any) {
  //   node.properties.className = ['word'];
  // },
};

export default makeSource({
  contentDirPath: 'content/articles',
  documentTypes: [Article],
  mdx: {
    esbuildOptions(options) {
      options.target = 'esnext';
      return options;
    },
    remarkPlugins: [[remarkGfm], [remarkMath], [remarkSourceRedirect]],
    rehypePlugins: [
      [rehypeKatex],
      [rehypeSlug],
      [withToc],
      [withTocExport, { name: 'toc' }],
      [rehypePrettyCode, PrettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
  },
});
