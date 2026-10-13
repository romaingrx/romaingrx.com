# romaingrx.com

Personal website and blog. Astro, TypeScript, Tailwind CSS 4, and React islands only where a page needs interaction. Deployed on Cloudflare at romaingrx.com.

The goal of the codebase is a site that is clean, simple, and light. Every rule below serves that goal.

# Task execution

- The request defines the task. These rules and the skills support it.
- Continue authorized work through implementation and verification.
- Resolve routine choices from the request and the existing code.
- Ask only when missing information prevents a correct result.
- Keep reports short. State the result, the verification, and what remains.

# Commands

- `pnpm dev` — start the dev server (generates Cloudflare types first).
- `pnpm build` — type-check and build to `dist/`.
- `pnpm check` — Astro type check.
- `pnpm lint` / `pnpm lint:fix` — Oxlint.
- `pnpm format` / `pnpm format:check` — Oxfmt for JS/TS/CSS/JSON/MD/MDX, Prettier for `.astro`.
- `pnpm bundle-report` — client JS per page.
- `pnpm deploy` — build and deploy. Run it only when Romain asks.

# Workflow

- After an edit batch, run `pnpm format` on the changed files.
- Before you push, run `pnpm lint`, `pnpm format:check`, and `pnpm build`. CI runs the same checks.
- For a refactor, the built HTML must not change. Build `main` and the branch, then diff `dist/`. The `reviewing-changes` skill tells how.
- For a docs-only change, check formatting and the paths you reference. A build is not necessary.
- Use conventional commits: `type(scope): description`. The `commit` skill has the rules.
- PRs are squash merged. Merge only when Romain says to.

# Conventions

- **Choose the simplest implementation that meets the current need.** Do not design for needs that do not exist yet.
- **Do not keep backward compatibility.** Delete replaced code in the same change. Do not keep aliases, shims, or re-exports for old paths.
- **SOLID and DRY.** One responsibility per file. When two files share markup or logic, extract it before you add a third copy. Search `src/components/ui/`, `src/components/patterns/` and `src/lib/` before you write something generic.
- **Blog posts and notes are the same kind of entry.** Code that works for one must work for both, with the collection as a parameter. Do not fork a `note/` copy of a `blog/` component.
- **Fail loudly.** Throw on missing or unexpected data at build time. Do not return empty strings or silent defaults.
- **Ship no JS by default.** Use an Astro component. Use a React island (`client:visible`) only for real interaction.
- **Prefer a maintained library to custom code**, but add a dependency only when it removes more code than it adds.
- **Comments must earn their place.** Read the `code-comments` skill before you write or review comments.
- Use `kebab-case` for file and folder names outside `src/content/` and `src/pages/` route params.
- Build every URL with `src/configs/routes.ts`. Do not concatenate paths in components.
- Put site-wide values (names, ids, URLs) in `src/configs/`. Do not hard-code them in components.

# Structure

Each layer imports only from its own layer or a lower one. Never import upward.

| Layer | Path                                                    | Holds                                                                      |
| ----- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| 0     | `src/lib/`, `src/configs/`, `src/content.config.ts`     | Pure helpers, data access, site config, schemas. No components.            |
| 1     | `src/components/ui/`                                    | Primitives. Render from props alone. No content or routes.                 |
| 2     | `src/components/patterns/`                              | Compositions of primitives used on more than one page.                     |
| 3     | `src/components/<feature>/` (`blog/`, `note/`, `home/`) | Components that know about an entry, a route, or a page section.           |
| 4     | `src/layouts/`                                          | Page shells. A component that wraps `BaseLayout` is a layout and goes here. |
| 5     | `src/pages/`                                            | Routes. Fetch data, pick a layout, render. Keep logic in `src/lib/`.       |

Content lives in `src/content/<collection>/<entry>/index.mdx`, with the entry's images, data and islands in the same folder. Collections: `blog`, `note`, `timeline`, `author`.

The `site-structure` skill has the decision table for where a new file goes.

## UI primitives

- Import a primitive from its folder: `import { Button } from '@/components/ui/button'`.
- Primitives are Astro components and ship no JS. Styles live in `variants.ts` (CVA), so a React twin (`button.tsx`, `card.tsx`) can share them.
- Every primitive sets `data-slot`. Compose with `cn()` and the `class` prop. Do not add a variant for a one-off change.
- Use `Text`/`Heading` for typography and `Stack`/`Grid`/`Container` for layout. Do not repeat utility strings.
- Hover cards, tooltips, carousels and dialogs are CSS or a small inline script, not React.

## MDX and islands

- An MDX entry imports each island from its own file, never through a barrel, so each island gets its own chunk.
- An entry's run data lives in one JSON file per widget (`data/<field>.json`), so each island ships only its own data.
- The `adding-content` skill covers new posts, notes, and islands.

# Skills

Skills live in `.agents/skills/<name>/SKILL.md`. `.claude/skills` links to that folder.

- Read a skill when its description matches the work.
- Read a skill's references only when the current step needs them.
- When you find a recurring gotcha or a missing convention, propose an update to this file or to a skill.

# Sources of information

Each kind of information has one location. Link to it. Do not copy it.

| Information             | Location                     |
| ----------------------- | ---------------------------- |
| Conventions             | `AGENTS.md`, `.agents/skills/` |
| Content schemas         | `src/content.config.ts`      |
| Routes                  | `src/configs/routes.ts`      |
| Site metadata           | `src/configs/site.ts`        |
| Build and integrations  | `astro.config.mjs`           |
| History                 | Git commits and PRs          |

Documents describe the current code. They do not record history or status.
