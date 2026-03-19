# Generate a Twitter/X thread from a blog post

Turn a blog post into a Twitter thread and push it to Typefully as a draft.

## Input

$ARGUMENTS should be a blog post slug (e.g., `20260301-vae`) or a path to a blog post directory. If empty, list available blog posts in `src/content/blog/` and ask the user to pick one.

## Steps

### 1. Resolve the blog post

Find the blog post MDX file at `src/content/blog/<slug>/index.mdx`. Read the full file.

Also inventory the visual assets:

- List all files in `src/content/blog/<slug>/images/` (PNGs, JPGs, SVGs)
- Note the cover image path from frontmatter if present
- Note any React component imports — these are interactive demos that can't be embedded but are worth teasing in the thread

### 2. Generate the thread

Write a Twitter thread (5-12 tweets) from the blog post content.

**Opening tweet:**

- Lead with a compelling hook or question — NOT "I wrote a blog post"
- Make it standalone-interesting so people want to read more
- No link in the first tweet

**Middle tweets:**

- Each tweet is a self-contained insight or takeaway
- Simple language — translate LaTeX/math into plain English
- If the post has code, pick ONE short snippet (max 4 lines) or describe the insight
- Mention interactive demos/visualizations as a reason to read the full post
- Each tweet MUST be under 280 characters
- Use line breaks for readability

**Final tweet:**

- Link to the blog post: `https://romaingrx.com/blog/<slug>`
- Brief call to action (e.g., "Full post with interactive demos and code:")

**Image strategy:**

- Identify which tweets should have an image attached for maximum impact
- The cover image goes on the opening tweet
- Use at most 2-3 images total across the thread — pick the most visually striking ones
- For excalidraw diagrams or interactive component screenshots, note them but explain the user may need to export/screenshot them manually

**Style:**

- Technical but approachable, no hype
- No hashtags, no emojis unless they genuinely add clarity
- Thread should make sense even without clicking the link
- Concrete examples over abstract claims

### 3. Show the thread to the user for review

Display the thread with tweet numbers, character counts, and image annotations:

```
**Tweet 1** (X chars) [cover image]
> tweet content here

**Tweet 2** (X chars)
> tweet content here

**Tweet 3** (X chars) [images/unet.excalidraw → export as PNG]
> tweet content here
```

List the images that will be uploaded and ask the user to approve or edit before proceeding.

### 4. Push to Typefully

After user approval, use the Typefully skill to create the draft:

**Step 4a — Upload images:**
For each image to attach, upload it via the Typefully skill:

```bash
.claude/skills/typefully/scripts/typefully.cjs media:upload <image_path>
```

Collect the returned `media_id` values.

**Step 4b — Create the thread draft:**
Write the full thread to a temp file using `---` as the tweet separator, then create the draft:

```bash
.claude/skills/typefully/scripts/typefully.cjs drafts:create --platform x,bluesky --file /tmp/thread.txt --media <comma-separated-media-ids>
```

Note: the `--media` flag attaches images to the first tweet. If images need to go on specific tweets, tell the user they can rearrange them in Typefully's editor.

**Step 4c — Clean up** the temp file.

### 5. Confirm

Show the user:

- The Typefully draft URL: `https://typefully.com/?d=<draft_id>`
- Remind them to review the draft in Typefully, rearrange images if needed, and schedule it
