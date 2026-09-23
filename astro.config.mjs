import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import astroTypesafeRoutes from 'astro-typesafe-routes';

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
import { site } from './src/configs/site';
import routeReport from './src/integrations/route-report.mjs';
import { excalidraw } from './src/lib/excalidraw';
import { rehypeCitationRelative } from './src/lib/rehype-citation-wrapper.mjs';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  adapter: import.meta.env.PROD
    ? cloudflare({
        imageService: 'custom',
        prerenderEnvironment: 'node',
      })
    : undefined,
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
    processor: unified({
      remarkPlugins: [remarkMath],
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
      gfm: true,
      smartypants: true,
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
    mdx({ optimize: true }),
    sitemap(),
    react(),

    icon({
      include: {
        mdi: ['*'],
        'simple-icons': ['*'],
      },
    }),
    pagefind({ indexConfig: { rootSelector: 'main[data-pagefind-body]' } }),
    astroTypesafeRoutes(),
    routeReport,
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
