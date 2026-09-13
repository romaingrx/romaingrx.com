import { $path } from 'astro-typesafe-routes/path';

const articlePath = $path({
  to: '/blog/[...slug]',
  params: { slug: 'stable-permalink' },
});

const taxonomyPath = $path({
  to: '/blog/tag/[tag]',
  params: { tag: encodeURIComponent('from scratch') },
});

void articlePath;
void taxonomyPath;

// @ts-expect-error Unknown route IDs must be rejected by generated declarations.
$path({ to: '/blog/[slug]' });

// @ts-expect-error Route params must match the generated route declaration.
$path({ to: '/blog/[...slug]', params: { post: 'wrong-name' } });
