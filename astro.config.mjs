// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import remarkReadingTime from 'remark-reading-time';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.romaingrx.com',
  integrations: [
    mdx({
      shikiConfig: {
        theme: 'one-dark-pro',
      },
      remarkPlugins: [
        [remarkReadingTime, { name: "readingTime" }],
      ],
    }),
    sitemap(),
    react(),
    tailwind({ applyBaseStyles: false }),
    icon()
  ],
});