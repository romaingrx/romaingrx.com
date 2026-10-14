import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';

// Astro integrations
import cloudflare from '@astrojs/cloudflare';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField, fontProviders } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
// Rehype/Remark plugins
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import { shikiConfig } from './src/configs/shiki';
import { excalidraw } from './src/lib/excalidraw';
import { rehypeCitationRelative } from './src/lib/rehype-citation-wrapper.mjs';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD ? 'https://romaingrx.com' : 'http://localhost:4321',
  adapter: cloudflare({
    // Optimize images with sharp at build time; dev serves originals.
    imageService: import.meta.env.PROD ? 'custom' : 'passthrough',
    prerenderEnvironment: 'node',
  }),
  env: {
    schema: {
      NODE_ENV: envField.enum({
        required: true,
        values: ['development', 'production'],
        context: 'client',
        access: 'public',
        default: 'development',
      }),
    },
  },
  markdown: {
    // Astro 7 renders Markdown with Sätteri by default; the remark/rehype
    // plugins below need the unified processor. MDX inherits it.
    processor: unified({
      remarkPlugins: [remarkMath, remarkReadingTime],
      rehypePlugins: [
        rehypeKatex,
        rehypeCitationRelative,
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        ],
      ],
    }),
  },
  integrations: [
    expressiveCode({
      // TODO romaingrx: make a theme aware of the current theme
      theme: 'one-dark-pro',
      shiki: shikiConfig,
      defaultProps: {
        wrap: true,
        preserveIndent: true,
      },
      plugins: [pluginLineNumbers()],
    }),
    mdx({
      optimize: true,
    }),
    sitemap(),
    react(),

    icon({
      include: {
        mdi: ['*'],
        'simple-icons': ['*'],
      },
    }),
    pagefind(),
  ],
  vite: {
    plugins: [tailwindcss(), excalidraw()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        'react-dom/server': 'react-dom/server.edge',
      },
    },
  },
  // Astro 7 defaults to 'jsx', which strips whitespace between inline
  // elements; keep the v6 behavior so prose and links render as before.
  compressHTML: true,
  prefetch: {
    defaultStrategy: 'viewport',
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fira Code',
      cssVariable: '--font-fira-code',
    },
    {
      provider: fontProviders.google(),
      name: 'Fira Sans',
      cssVariable: '--font-fira-sans',
    },
  ],
});
