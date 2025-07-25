import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD ? 'https://romaingrx.com' : 'http://localhost:4321',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'passthrough',
  }),
  integrations: [
    mdx({
      shikiConfig: {
        theme: 'one-dark-pro',
      },
      remarkPlugins: [remarkReadingTime],
    }),
    sitemap(),
    react(),
    tailwind({ applyBaseStyles: false }),
    icon({
      include: {
        mdi: ['*'],
        'simple-icons': ['*'],
      },
    }),
  ],
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        'react-dom/server': 'react-dom/server.edge',
      },
    },
  },
});
