---
name: reviewing-changes
description: Proves that a refactor does not change the built site by diffing dist/ against main. Use when you finish or review a refactor.
---

# Prove a refactor with a `dist/` diff

```sh
git worktree add ../site-main origin/main
(cd ../site-main && pnpm install --frozen-lockfile && pnpm build)
pnpm build
diff -r ../site-main/dist/client dist/client --exclude=_astro | head -100
git worktree remove ../site-main
```

- Hashed asset names in `_astro/` change between builds. Compare HTML, not hashes.
- An HTML difference is a finding. Explain it in the PR, or remove it.
