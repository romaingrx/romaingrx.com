---
name: site-structure
description: Decides where a new component, helper, config value, or layout goes in this Astro site. Use when you add, move, or split a file.
---

# Site structure

The layer table in `AGENTS.md` is the rule: a file imports only from its own layer or a lower one. This skill tells which layer a new file belongs to.

## Decision table

| What you are adding                                          | Goes in                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| A pure function (format, sort, filter, URL)                  | `src/lib/`                                                         |
| Data access for a collection (load, relate, group by tag)    | `src/lib/collections.ts`                                           |
| A route or a URL shape                                       | `src/configs/routes.ts`                                            |
| A site-wide value (name, repo, third-party id)               | `src/configs/site.ts`                                              |
| A frontmatter field                                          | `src/content.config.ts`                                            |
| UI that renders from props alone, with no entry or route     | `src/components/ui/<name>/`                                        |
| A composition of primitives used on more than one page       | `src/components/patterns/<name>/`                                  |
| UI that knows about an entry, a route, or one page section   | `src/components/<feature>/` (`entry/` if posts and notes share it) |
| A React island that entries import                           | `src/components/widgets/`                                          |
| A building block that MDX authors use (`Callout`, `Columns`) | `src/components/mdx/`, registered in `mdx/index.ts`                |
| A page shell that wraps `BaseLayout`                         | `src/layouts/`                                                     |
| A widget used by one entry only                              | that entry's folder in `src/content/`                              |

## The props-only test

Ask: can this component render from its props alone, with no `astro:content` import, no `routes`, and no entry type?

- Yes: it is a primitive or a pattern. Put it in `ui/` or `patterns/`.
- No: it is a feature component. Put it in the feature folder.

## Before you add a file

1. Search `src/components/ui/`, `src/components/patterns/` and `src/lib/` for something close.
2. If something close exists, extend it. Do not fork it.
3. If you copy more than a few lines from another file, extract the shared part first.
