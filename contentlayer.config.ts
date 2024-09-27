import { makeSource } from 'contentlayer2/source-files';
import Article from './content/definitions/Article';

import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkSourceRedirect from './content/plugins/remarkSourceRedirect';
import rehypeMetaAsAttributes from './content/plugins/metastringExtraction';
// @ts-ignore
import { remarkMermaid } from '@theguild/remark-mermaid';

export default makeSource({
  contentDirPath: 'content/articles',
  documentTypes: [Article],
  mdx: {
    esbuildOptions(options) {
      options.target = 'esnext';
      return options;
    },
    remarkPlugins: [
      remarkMermaid,
      [remarkGfm],
      [remarkMath],
      [remarkSourceRedirect],
    ],
    rehypePlugins: [
      [rehypeKatex],
      [rehypeSlug],
      // [withToc],
      // [withTocExport],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: {
            className: ['anchor'],
          },
        },
      ],
      [rehypeMetaAsAttributes],
    ],
  },
});
