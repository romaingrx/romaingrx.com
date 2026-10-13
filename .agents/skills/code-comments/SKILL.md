---
name: code-comments
description: Writes and reviews code comments and doc comments. Use when you add a comment or review a change that adds or edits comments.
---

# Code comments

Write the code first. Add a comment only where the code cannot show the reason. Default to none.

## The test

A comment must not repeat what the name and the signature already say. Read the symbol, then read the comment. If the comment tells you nothing new, delete it.

```ts
// Bad: the name already says this.
// Get all blog posts
const allPosts = await getBlogPosts();

// Good: a constraint the code cannot show.
// Giscus reads data-theme only when it creates its iframe.
```

## What a comment must carry

Use one of these:

- A constraint from outside the file: a library behavior, a browser quirk, an Astro or Cloudflare limit.
- A measured cost, with the number.
- A decision, and the option you refused.
- A hazard that the next edit can trip.

## Never narrate a change

Do not write "now", "previously", "renamed", or "moved from". Do not give a PR number as the explanation. History belongs in commits and PRs.

## No section banners

Do not label markup blocks (`<!-- Tags Section -->`). A component name or a heading in the markup already says what the block is.

## No commented-out code

Delete it. Git keeps it.
