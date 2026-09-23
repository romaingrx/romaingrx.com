# Contributing

Use Node.js 22.23.2 and pnpm 11.22.0 for local work. The version files and
`packageManager` field are the source of truth for those tools.

Install with the lockfile and keep package integrity checks enabled:

```sh
corepack enable
corepack prepare pnpm@11.22.0 --activate
pnpm install --frozen-lockfile
```

Run the checks before opening a pull request:

Link draft pull requests to the stack before marking them ready so checks run with stack metadata.

```sh
pnpm lint
pnpm format:check
pnpm check
pnpm build
pnpm test:routes
pnpm exec playwright install chromium
pnpm test:browser
```

Build before running the browser suite. Playwright checks published routes on a
Wrangler production preview and checks the private design fixture on Astro dev.
The development fixture is not part of the production build.

Do not disable Corepack or pnpm integrity verification to work around an
installation error. Update the toolchain or lockfile when the supported
versions change.

## Navigation and overlay behavior

Use native `<dialog>` and `showModal()` for Astro overlays. Give each dialog an
accessible name, a visible Close control, and a useful initial focus target.
Open dialogs with `showModal(dialog, opener)` so the opener has focus before
the browser records where to restore focus.
Escape and Close dismiss the dialog. Backdrop dismissal requires the pointer to
start and end on the backdrop, so dragging out of dialog content does not close
it. Native modal dialogs contain keyboard focus and restore it to the opener.
Lock document scrolling with `html:has(dialog:modal)` and
`body:has(dialog:modal)` CSS; do not save and restore inline overflow styles in
JavaScript.

Use the existing Radix dialog primitives for React islands. Include a dialog
title and visible Close control, and keep Escape dismissal, focus containment,
focus restoration, and backdrop dismissal consistent with Astro dialogs.

Photo galleries use a native button to open the dialog. Previous and Next
wrap from the last photo to the first and from the first to the last. A gallery
with zero photos has no opener; a one-photo gallery has no navigation
controls. The active photo's load or error event controls its status. On mobile,
the image keeps its aspect ratio and Close, Previous, and Next controls remain
at least 44 CSS pixels tall. Horizontal swipes navigate; vertical scrolling and
pinch zoom remain available.

Mobile navigation is a disclosure. Its button controls a menu with
`aria-controls` and `aria-expanded`. Keep the closed menu hidden from keyboard
and assistive technology. Escape closes the menu and returns focus to its
button. Keep the header visible while its menu is open or any header control has
focus. Keep a skip link before the header and give its main-content target a
programmatic focus target.

## Search indexing and behavior

Only published blog and note detail pages set `indexContent` in their layout.
The Pagefind root is `main[data-pagefind-body]`; keep each page title, summary,
and prose inside that main landmark. Add `data-pagefind-meta="title"` and
`data-pagefind-meta="description"` to the corresponding content fields. Do not
enable indexing for listing pages, fixtures, or site chrome. Mark transient
dialog content and interactive controls with `data-pagefind-ignore` while
keeping article explanations and captions searchable.

Search results use ordinary links. Arrow keys move DOM focus between result
links; Enter and modifier clicks keep their native link behavior. Query edits,
clear, and close invalidate pending work. Retry must recover both module-load
and query-data failures, and Show more loads only the next result batch. Run a
production build before browser tests so both Pagefind and Wrangler use the
current source.

## Article structure and Contents

An article page has one H1 in its header. Begin body sections at H2 and nest
subsections one level lower. Notes and blog posts use the shared `.prose`
typography and Contents component, while their headers can keep distinct
layouts. Keep existing heading IDs stable when changing heading levels. The
generated References heading is H2 and keeps the `references` ID.

Contents is a native `<details>` disclosure with a `<summary>` label. Its links
target body heading IDs, update `aria-current="location"` for the latest
section above the sticky header, and use a scroll margin that clears the header.
Keep the disclosure usable by keyboard and touch at every viewport size.

Inline citations remain ordinary links to bibliography entries. Each cited
entry provides visible return links to all citation occurrences. Keep those
links available without hover and preserve citation and bibliography IDs.

## Scientific widgets

Use `StepSlider` with either `mode="steps"` and `steps`, or `mode="examples"`
and `examples`; do not mix both data shapes. Keep playback timers in the shared
`usePlayback` hook used by `StepSlider` and `EpochProgress`. Seeking or changing
examples pauses playback, and playback stops on its final frame. Keep scientific
samples in square, `object-fit: contain` frames so their proportions remain
stable on narrow screens.
