import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

/** @type {import('astro').AstroIntegration} */
const routeReport = {
  name: 'route-report',
  hooks: {
    'astro:build:done': async ({ pages, dir, assets }) => {
      if (pages.length === 0) {
        throw new Error('Astro produced no pages during the production build.');
      }

      const reportPath = path.resolve('.astro/route-manifest.json');
      const report = {
        outputDirectory: dir.href,
        pages: pages.map(({ pathname }) => pathname).toSorted(),
        assets: [...assets.entries()].map(([name, urls]) => ({
          name,
          files: urls.map((url) => url.href),
        })),
      };

      await mkdir(path.dirname(reportPath), { recursive: true });
      await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
    },
  },
};

export default routeReport;
