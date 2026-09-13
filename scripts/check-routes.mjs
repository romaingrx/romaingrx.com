import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const outputDirectory = path.resolve('dist/client');

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory());
  const nestedFiles = await Promise.all(
    directories.map((entry) => collectFiles(path.join(directory, entry.name))),
  );
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(directory, entry.name));

  return files.concat(nestedFiles.flat());
}

function routeFromFile(file) {
  const relative = path.relative(outputDirectory, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  return `/${relative.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
}

try {
  const files = await collectFiles(outputDirectory);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  const routes = htmlFiles.map(routeFromFile).toSorted();
  const { html: expectedRoutes, files: expectedFiles } = JSON.parse(
    await readFile(new URL('../docs/route-manifest.json', import.meta.url), 'utf8'),
  );
  const routeSet = new Set(routes);
  const missingRoutes = expectedRoutes.filter((route) => !routeSet.has(route));
  const actualFiles = new Set(
    files.map((file) => `/${path.relative(outputDirectory, file).split(path.sep).join('/')}`),
  );
  const missingFiles = expectedFiles.filter((file) => !actualFiles.has(file));
  const leakedRoutes = routes.filter(
    (route) => route === '/design' || route.startsWith('/design/'),
  );

  const sitemapFiles = files.filter((file) => path.basename(file).startsWith('sitemap'));
  const sitemap = await Promise.all(sitemapFiles.map((file) => readFile(file, 'utf8')));
  const fixtureInSitemap = sitemap.some((contents) => contents.includes('/design'));

  if (missingRoutes.length || missingFiles.length || leakedRoutes.length || fixtureInSitemap) {
    if (missingRoutes.length) console.error(`Missing expected routes: ${missingRoutes.join(', ')}`);
    if (missingFiles.length)
      console.error(`Missing expected output files: ${missingFiles.join(', ')}`);
    if (leakedRoutes.length)
      console.error(`Fixture routes found in production: ${leakedRoutes.join(', ')}`);
    if (fixtureInSitemap) console.error('The development fixture is present in the sitemap.');
    process.exitCode = 1;
  }

  console.log(`Production HTML routes (${routes.length}):`);
  for (const route of routes) console.log(`- ${route}`);
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.error(`Missing ${outputDirectory}. Run "pnpm build" first.`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
}
