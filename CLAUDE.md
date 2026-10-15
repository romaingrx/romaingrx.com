# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website/blog built with **Astro 5.12.3**, TypeScript, React, and Tailwind CSS, deployed on Cloudflare Pages at romaingrx.com. The site uses structured content collections for blogs, notes, timeline entries, and author profiles.

## Development Commands

### Common Development Tasks

- `pnpm dev` - Start development server (includes Cloudflare types generation)
- `pnpm build` - Type check and build for production
- `pnpm check` - Run Astro type checking
- `pnpm lint` - Run Oxlint
- `pnpm lint:fix` - Fix Oxlint issues automatically
- `pnpm format` - Format code with Oxfmt (JS/TS/CSS/JSON/MD/MDX) and Prettier (.astro only)
- `pnpm format:check` - Check formatting without writing

### Deployment

- `pnpm deploy` - Build and deploy to Cloudflare Pages
- `pnpm preview` - Build and preview with Wrangler locally

## Architecture Overview

### Content Management System

The site uses Astro's **content collections** with Zod schemas for type safety:

- `/src/content/blog/` - Blog posts with frontmatter, images, references
- `/src/content/note/` - Personal notes and documentation
- `/src/content/timeline/` - Career/education timeline entries
- `/src/content/author/` - Author profiles

Content collections are configured in `src/content.config.ts` with strict schemas.

### Component Architecture

- `/src/components/ui/` - Primitives, one folder each (`button/`, `badge/`, `card/`, `text/`, `stack/`, `grid/`, `container/`, `link/`, `hover-card/`, `tooltip/`, `alert/`, `dialog/`, `prose/`, ...). Import from the folder: `import { Button } from '@/components/ui/button'`.
- `/src/components/patterns/` - Compositions of primitives reused across pages (`page-header/`, `section-header/`)
- `/src/components/blog/` - Blog-specific components (cards, footers, resources)
- `/src/components/charts/` - Build-time SVG charts (`LineChart`, `ScatterChart`, `BarChart`, `ChartCard`), imported from `@/components/charts`
- `/src/layouts/` - Page layout templates (Base, Blog, Note)

### UI conventions

- Primitives are Astro components and ship no JS. Styles live in a `variants.ts` (CVA) so a React twin (`button.tsx`, `card.tsx`) can share them when an island needs one.
- Every primitive sets `data-slot`. Compose with `cn()` and the `class` prop rather than new variants for one-off tweaks.
- Use `Text`/`Heading` for typography and `Stack`/`Grid`/`Container` for layout instead of repeating utility strings.
- Only reach for a React island (`client:visible`) when the component is interactive. Hover cards, tooltips, carousels and dialogs are CSS or a small inline script.
- Charts render to SVG at build time and ship no framework JS. A new chart type composes `parts/` (`ChartRoot`, `PlotFrame`, `PlotSvg`, `Marker`, `Legend`) and `lib/axis.ts`, declares its payload type in `lib/payload.ts`, and adds hover with `bindHover(kind, …)` from `client/hover.ts`.
- MDX posts import each island from its own file, never through a barrel, so each island gets its own chunk. A post's run data lives in one JSON file per widget (`data/<field>.json`), so each island ships only its own data and keeps its inferred type.

### Key Configuration Files

- `src/configs/site.ts` - Site metadata and settings
- `src/configs/resources.ts` - External resource definitions
- `astro.config.mjs` - Astro integrations and build settings
- `tailwind.config.mjs` - Custom design system with themes

### Content Features

- **MDX support** with custom components and citations
- **Bibliography system** supporting multiple citation styles (configured in frontmatter)
- **Resource linking** for external content references
- **Custom syntax highlighting** including CUDA language support
- **OG image generation** for social sharing

### Styling System

- **Tailwind CSS** with custom design tokens
- **Dark/light mode** toggle with system preference detection
- **Typography system** with custom prose styling
- **Component-based** architecture with Radix UI primitives

## Development Notes

- Uses **pnpm** as package manager
- **TypeScript strict mode** enabled with path aliases (`@/` for src/)
- **File-based routing** in `/src/pages/` with dynamic routes for content
- **Edge deployment** optimized for Cloudflare Workers
- Code formatting enforced by Oxfmt (with Prettier for .astro files), linting by Oxlint
- Custom language grammars located in `/public/grammars/`
