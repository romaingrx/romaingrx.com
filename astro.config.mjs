import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import sentry from "@sentry/astro";
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

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
      clientInitPath: "src/sentry.client.config.ts",
      serverInitPath: "src/sentry.server.config.ts",
      sourceMapsUploadOptions: {
        project: "romaingrxcom",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      enableClientWebpackPlugin: false,
      enableServerWebpackPlugin: false,
      replays: {
        enabled: false,
      },
      telemetry: false,
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
  vite: {
    build: {
      sourcemap: 'inline',
    },
    ssr: {
      noExternal: ['@sentry/*'],
    },
    resolve: {
      alias: {
        'node:util': 'util',
        // Use react-dom/server.edge instead of react-dom/server.browser for React 19
        // This fixes the MessageChannel not defined error in Cloudflare
        ...(import.meta.env.PROD && {
          'react-dom/server': 'react-dom/server.edge',
        }),
      }
    }
  },
});