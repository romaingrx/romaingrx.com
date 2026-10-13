---
name: reviewing-changes
description: Reviews a change to this site before push or merge, and proves that a refactor does not change the built output. Use when you review a PR or finish a refactor.
---

# Reviewing changes

## Route each rule to the cheapest check

| Check                                     | Owner                         |
| ----------------------------------------- | ----------------------------- |
| Syntax, imports, unused code              | `pnpm lint`                   |
| Formatting                                | `pnpm format:check`           |
| Types and content schemas                 | `pnpm check`                  |
| A refactor changes nothing a reader sees  | The `dist/` diff below        |
| Client JS per page                        | `pnpm bundle-report`          |
| Structure, naming, duplication, clarity   | Review, with the checklist    |

Do not spend review effort on what a tool already catches. When a rule can be checked by a tool, add it to the tool. Do not add it to this checklist.

## Prove a refactor with a `dist/` diff

```sh
git worktree add ../site-main origin/main
(cd ../site-main && pnpm install --frozen-lockfile && pnpm build)
pnpm build
diff -r ../site-main/dist/client dist/client --exclude=_astro | head -100
git worktree remove ../site-main
```

- Hashed asset names in `_astro/` change between builds. Compare HTML, not hashes.
- An HTML difference is a finding. Explain it in the PR, or remove it.

## Checklist

- Each file has one responsibility. A file that does two things is split.
- No markup or logic is copied between `blog/` and `note/`.
- No file imports from a higher layer (see `AGENTS.md`).
- Every URL comes from `src/configs/routes.ts`.
- Replaced code is deleted. No alias, shim, or re-export stays behind.
- No new client JS without interaction that needs it.
- Comments follow the `code-comments` skill.
- File and folder names are `kebab-case`.

Report each finding with a location, the problem, and a fix.
