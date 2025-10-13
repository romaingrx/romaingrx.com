# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website/blog built with **Astro 5.12.3**, TypeScript, React, and Tailwind CSS, deployed on Cloudflare Pages at romaingrx.com. The site uses structured content collections for blogs, notes, timeline entries, and author profiles.

## Development Commands

### Common Development Tasks

- `pnpm dev` - Start development server (includes Cloudflare types generation)
- `pnpm build` - Type check and build for production
- `pnpm check` - Run Astro type checking
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier

### Deployment

- `pnpm deploy` - Build and deploy to Cloudflare Pages
- `pnpm preview` - Build and preview with Wrangler locally

## Architecture Overview

### Content Management System

The site uses Astro's **content collections** with Zod schemas for type safety:

- `/content/blog/` - Blog posts with frontmatter, images, references
- `/content/note/` - Personal notes and documentation
- `/content/timeline/` - Career/education timeline entries
- `/content/author/` - Author profiles

Content collections are configured in `src/content.config.ts` with strict schemas.

### Component Architecture

- `/src/components/ui/` - shadcn/ui component library (buttons, cards, dialogs)
- `/src/components/blog/` - Blog-specific components (cards, prose styling)
- `/src/components/charts/` - Recharts visualization components
- `/src/layouts/` - Page layout templates (Base, Blog, Note)

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
- Code formatting enforced by Prettier, linting by ESLint
- Custom language grammars located in `/public/grammars/`
