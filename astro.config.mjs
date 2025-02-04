// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.romaingrx.com',
  output: 'server',
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
        'simple-icons': ['*']
      }
    })
  ],
  adapter: cloudflare({
    cloudflareModules: true,
    imageService: 'cloudflare',
  }),
  // vite: {
  //   ssr: {
  //     // Add Node.js polyfills for compatibility
  //     external: ['node:buffer', 'node:crypto', 'node:url', 'node:stream'],
  //   },
  //   build: {
  //     // Disable minification for better error messages during development
  //     minify: process.env.NODE_ENV === 'production',
  //   },
  // },
});