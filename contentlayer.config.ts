import { makeSource } from 'contentlayer/source-files';
import Article from './content/definitions/Article';

import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkSourceRedirect from './content/plugins/remarkSourceRedirect';
import rehypeMetaAsAttributes from './content/plugins/metastringExtraction';

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
