---
name: commit
description: Writes a conventional commit message or a squash-merge message for this repository. Use when you commit or merge.
---

# Commit

1. Read the change first: `git diff --staged`.
2. Write the subject as `type(scope): description`.
   - Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`.
   - Use the imperative mood ("add", not "added").
   - Keep the subject under 72 characters.
3. In the body, say what changed and why, grouped by area. Do not list every file.

## Squash merges

PRs are squash merged, and only when Romain says to merge.

- Write the squash message yourself from the final diff. Do not paste the list of branch commits.
- Do not add a `Co-Authored-By` line or any other AI attribution line.
