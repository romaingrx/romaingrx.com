import fs from 'node:fs';

import type { Plugin } from 'vite';

const PREFIX = '\0json-pick:';

/**
 * `import samples from './run.json?key=samples&pick'` imports one top-level key of a
 * JSON file as its own module. Islands that share one big data file then each ship
 * only their slice, instead of all of them pulling one shared chunk.
 */
export function jsonPick(): Plugin {
  return {
    name: 'json-pick',
    enforce: 'pre',
    async resolveId(source, importer) {
      const [path, query] = source.split('?');
      if (!query || !path.endsWith('.json') || !new URLSearchParams(query).has('pick')) return;
      const resolved = await this.resolve(path, importer, { skipSelf: true });
      const key = new URLSearchParams(query).get('key');
      // No `.json?` in the id, so Vite's own JSON plugin leaves this module alone.
      return resolved && `${PREFIX}${resolved.id}::${key}`;
    },
    load(id) {
      if (!id.startsWith(PREFIX)) return;
      const [file, key] = id.slice(PREFIX.length).split('::');
      this.addWatchFile(file);
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!key || key === 'null' || !(key in data))
        this.error(`json-pick: no key "${key}" in ${file}`);
      return `export default ${JSON.stringify(data[key])};`;
    },
  };
}
