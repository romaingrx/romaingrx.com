// Enforces the layer table in AGENTS.md: a file imports only from its own layer
// or a lower one. Oxlint does not read Astro frontmatter, so this script parses
// import specifiers itself.
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const LAYERS = [
  ['lib', /^src\/(lib|configs)\/|^src\/content\.config\.ts$/],
  ['ui', /^src\/components\/ui\//],
  ['patterns', /^src\/components\/patterns\//],
  ['feature', /^src\/components\//],
  ['layout', /^src\/layouts\//],
  ['page', /^src\/pages\//],
];

const layerOf = (path) => LAYERS.findIndex(([, pattern]) => pattern.test(path));

function* files(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.(astro|tsx?|mjs)$/.test(entry.name)) yield path;
  }
}

const IMPORT =
  /(?:import|export)\s[^'"]*?from\s+['"](@\/[^'"]+)['"]|import\(\s*['"](@\/[^'"]+)['"]/g;

const errors = [];
for (const file of files('src')) {
  const path = relative('.', file);
  const own = layerOf(path);
  if (own === -1) continue;
  for (const [, from, dynamic] of readFileSync(file, 'utf8').matchAll(IMPORT)) {
    const target = (from ?? dynamic).replace(/^@\//, 'src/');
    const layer = layerOf(target);
    if (layer > own) {
      errors.push(
        `${path}: a ${LAYERS[own][0]} file must not import ${LAYERS[layer][0]} code (${from ?? dynamic}).`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
