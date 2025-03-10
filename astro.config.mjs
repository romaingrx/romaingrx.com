import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import sentry from "@sentry/astro";
import icon from 'astro-icon';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';
import { transformerCompactLineOptions, transformerMetaHighlight, transformerMetaWordHighlight, transformerNotationHighlight, transformerStyleToClass } from '@shikijs/transformers';

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD ? 'https://romaingrx.com' : 'http://localhost:4321',
  // output: 'server',
  // adapter: cloudflare({
  //   platformProxy: {
  //     enabled: true,
  //   },
  //   imageService: 'compile',
  // }),
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
        themes: {
          light: 'github-dark',
          dark: 'github-dark',
        },
        transformers: [
          transformerMetaHighlight({
            // Custom CSS class for highlighted lines
            highlightClassName: 'highlighted',
            // Custom CSS class for focused lines
            focusClassName: 'focused',
            // Add a class to the pre element
            preClassName: ({ lines = [] }) => {
              if (lines.some(line => line.classes?.includes('highlighted'))) {
                return 'has-highlighted';
              }
              if (lines.some(line => line.classes?.includes('focused'))) {
                return 'has-focused';
              }
              return '';
            },
          }),
          transformerMetaWordHighlight({
            // Custom CSS class for highlighted words
            highlightClassName: 'highlighted-word',
          }),
          transformerNotationHighlight({
            // Custom CSS classes for different notation types
            classMap: {
              // For error underlines
              err: 'error',
              // For warning underlines
              warn: 'warning',
              // For info underlines
              info: 'info',
              // For success underlines
              success: 'success',
              // For highlight
              highlight: 'highlighted',
              // For focus
              focus: 'focused',
            },
            // Use v3 matching algorithm for better notation matching
            matchAlgorithm: 'v3',
            // Enable inline annotations
            inlineAnnotations: true,
            // Add a class to the pre element for notation types
            preClassName: ({ lines = [] }) => {
              if (lines.some(line => line.classes?.includes('error'))) {
                return 'has-error';
              }
              if (lines.some(line => line.classes?.includes('warning'))) {
                return 'has-warning';
              }
              if (lines.some(line => line.classes?.includes('info'))) {
                return 'has-info';
              }
              if (lines.some(line => line.classes?.includes('success'))) {
                return 'has-success';
              }
              return '';
            },
          }),
          // Add transformerCompactLineOptions to ensure proper line options handling
          transformerCompactLineOptions(),
        ],
        wrap: true,
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
  // vite: {
  //   resolve: {
  //     // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
  //     // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
  //     alias: import.meta.env.PROD && {
  //       "react-dom/server": "react-dom/server.edge",

  //     },
  //   },
  // },
});