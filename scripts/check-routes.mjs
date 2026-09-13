import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const reportPath = path.resolve('.astro/route-manifest.json');

function formatList(items) {
  return items.length ? items.join(', ') : 'none';
}

function isFixturePath(pathname) {
  const normalized = pathname.replace(/^\/+/, '');
  return normalized === 'design' || normalized.startsWith('design/');
}

function sitemapContainsFixture(contents) {
  return [...contents.matchAll(/<loc>([^<]+)<\/loc>/g)].some(([, location]) => {
    try {
      return isFixturePath(new URL(location).pathname);
    } catch {
      return isFixturePath(location);
    }
  });
}

try {
  const report = JSON.parse(await readFile(reportPath, 'utf8'));
  const outputDirectory = fileURLToPath(new URL(report.outputDirectory));
  const outputEntries = await readdir(outputDirectory, { withFileTypes: true });
  const outputFiles = report.assets.flatMap(({ files: urls }) =>
    urls.map((url) => fileURLToPath(url)),
  );
  const htmlOutputs = outputFiles.filter((file) => file.endsWith('.html'));
  const missingAssets = (
    await Promise.all(
      outputFiles.map(async (file) => {
        try {
          await access(file);
          return null;
        } catch {
          return file;
        }
      }),
    )
  ).filter((file) => file !== null);

  const fixtureRoutes = report.pages.filter(isFixturePath);
  const sitemapFiles = outputEntries
    .filter((entry) => entry.isFile() && entry.name.startsWith('sitemap'))
    .map((entry) => path.join(outputDirectory, entry.name));
  const sitemap = await Promise.all(sitemapFiles.map((file) => readFile(file, 'utf8')));
  const fixtureInSitemap = sitemap.some((sitemapContents) =>
    sitemapContainsFixture(sitemapContents),
  );
  const errors = [];

  if (outputFiles.length === 0 || htmlOutputs.length === 0)
    errors.push('Astro emitted no page or asset outputs.');
  if (htmlOutputs.length !== report.pages.length)
    errors.push('The generated page count does not match emitted HTML outputs.');
  if (missingAssets.length) errors.push('Missing generated assets: ' + formatList(missingAssets));
  if (fixtureRoutes.length)
    errors.push('Fixture routes found in production: ' + formatList(fixtureRoutes));
  if (fixtureInSitemap) errors.push('The development fixture is present in the sitemap.');

  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exitCode = 1;
  }

  console.log('Production HTML outputs (' + htmlOutputs.length + ').');
  for (const route of report.pages) console.log('- /' + route);
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.error('Missing ' + reportPath + '. Run "pnpm build" first.');
  } else {
    console.error(error);
  }
  process.exitCode = 1;
}
