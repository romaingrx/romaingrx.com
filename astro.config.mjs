import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig, envField, fontProviders } from "astro/config";
// Astro integrations
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
// Rehype/Remark plugins
import rehypeExternalLinks from "rehype-external-links";
import { shikiConfig } from "./src/configs/shiki";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { rehypeCitationRelative } from "./src/lib/rehype-citation-wrapper.mjs";
import { remarkReadingTime } from "./src/lib/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
	site: import.meta.env.PROD
		? "https://romaingrx.com"
		: "http://localhost:4321",
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
		imageService: "passthrough",
	}),
	env: {
		schema: {
			NODE_ENV: envField.enum({
				required: true,
				values: ["development", "production"],
				context: "client",
				access: "public",
				default: "development",
			}),
		},
	},
	markdown: {
		remarkPlugins: [remarkReadingTime],
		rehypePlugins: [
			rehypeCitationRelative,
			[
				rehypeExternalLinks,
				{
					target: "_blank",
					rel: ["noopener", "noreferrer"],
				},
			],
		],
	},
	integrations: [
		expressiveCode({
			// TODO romaingrx: make a theme aware of the current theme
			theme: "one-dark-pro",
			shiki: shikiConfig,
			defaultProps: {
				wrap: true,
				preserveIndent: true,
			},
			plugins: [pluginLineNumbers()],
		}),
		mdx({
			gfm: true,
			optimize: true,
			smartypants: true,
		}),
		sitemap(),
		react(),
		tailwind({ applyBaseStyles: false }),
		icon({
			include: {
				mdi: ["*"],
				"simple-icons": ["*"],
			},
		}),
	],
	vite: {
		resolve: {
			// Use react-dom/server.edge instead of react-dom/server.browser for React 19.
			// Without this, MessageChannel from node:worker_threads needs to be polyfilled.
			alias: import.meta.env.PROD && {
				"react-dom/server": "react-dom/server.edge",
			},
		},
	},
	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: "Fira Code",
				cssVariable: "--font-fira-code",
			},
			{
				provider: fontProviders.google(),
				name: "Fira Sans",
				cssVariable: "--font-fira-sans",
			},
		],
	},
});
