import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import sentry from "@sentry/astro";
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// For build-time env vars
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
if (!SENTRY_AUTH_TOKEN) {
  throw new Error('SENTRY_AUTH_TOKEN is not set');
}

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.romaingrx.com',
  output: 'server',
  adapter: cloudflare({
    imageService: "passthrough",
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    sentry({
      dsn: "https://a774901c0480ea866cee1018309f96a7@o4508797318004736.ingest.de.sentry.io/4508797320036432",
      sourceMapsUploadOptions: {
        project: "romaingrxcom",
        authToken: SENTRY_AUTH_TOKEN
      },
      replaysOnErrorSampleRate: 0.0,
    }),
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
    }),
  ],
});