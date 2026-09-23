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

Mobile navigation is a disclosure. Its button controls a menu with
`aria-controls` and `aria-expanded`. Keep the closed menu hidden from keyboard
and assistive technology. Escape closes the menu and returns focus to its
button. Keep the header visible while its menu is open or any header control has
focus. Keep a skip link before the header and give its main-content target a
programmatic focus target.
