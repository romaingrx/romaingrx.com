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

```sh
pnpm lint
pnpm format:check
pnpm check
pnpm build
pnpm test:routes
pnpm exec playwright install chromium
pnpm test:browser
```

Do not disable Corepack or pnpm integrity verification to work around an
installation error. Update the toolchain or lockfile when the supported
versions change.
