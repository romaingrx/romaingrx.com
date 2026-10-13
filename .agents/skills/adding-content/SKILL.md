---
name: adding-content
description: Adds or edits a blog post, a note, or an interactive island inside an MDX entry. Use when you work in src/content/.
---

# Adding content

## Entry layout

Each entry is a folder with `index.mdx`. A short note can be a single `.mdx` file.

```text
src/content/blog/<yyyymmdd>-<slug>/
├── index.mdx
├── images/          # cover.png and inline images
├── components/      # islands and Astro widgets for this entry only
├── data/            # one JSON file per widget
├── code/            # source linked as a resource
└── references.bib   # bibliography, when the entry cites
```

## Frontmatter

The schema in `src/content.config.ts` is the source of truth. Read it before you add a field.

- Set `permalink` once. It is the URL segment, so a title edit never changes the URL.
- New entries start with `status: 'draft'`. Drafts render in dev and are hidden in production.
- Link a resource in `resources`. A `./` value resolves to the entry folder on GitHub.

## Islands

- Use an Astro component first. Use a React island only for real interaction.
- Hydrate with `client:visible`, so the island loads only when the reader reaches it.
- Import each island from its own file. Do not import through a barrel, or every island lands in one chunk.
- Put each widget's data in its own `data/<field>.json`. The island then ships only its data, and the JSON keeps its inferred type.
- Use the shared chart, playback, and step-slider components before you write a new one.

## Check

1. Run `pnpm build`.
2. Run `pnpm bundle-report` and compare the entry page with `main`. A new island must not grow other pages.
