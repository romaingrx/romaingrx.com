import fs from 'node:fs';
import { createRequire } from 'node:module';
import type { Plugin } from 'vite';

export interface ExcalidrawFile {
  type: string;
  version: number;
  source: string;
  elements: unknown[];
  appState?: Record<string, unknown>;
}

export interface ExcalidrawToSvgOptions {
  showBackground?: boolean;
}

/**
 * Set up a minimal browser-like environment using happy-dom so that
 * @excalidraw/utils exportToSvg can run in Node.js without Playwright.
 */
function setupDomEnvironment(): void {
  const require = createRequire(import.meta.url);
  const { Window } = require('happy-dom');
  const win = new Window({ url: 'http://localhost' });

  for (const key of Object.getOwnPropertyNames(win)) {
    if (!(key in globalThis) && key !== 'undefined') {
      try {
        (globalThis as any)[key] = win[key];
      } catch {
        // Some properties are non-configurable
      }
    }
  }
  (globalThis as any).window = win;
  (globalThis as any).devicePixelRatio = 1;

  // FontFace stub — excalidraw tries to register fonts via FontFace API
  if (!('FontFace' in globalThis)) {
    (globalThis as any).FontFace = class FontFace {
      family: string;
      status = 'loaded';
      unicodeRange = '';
      constructor(family: string) {
        this.family = family;
      }
      async load() {
        return this;
      }
    };
  }

  if (!win.document.fonts) {
    win.document.fonts = {
      add() {},
      check() {
        return true;
      },
      ready: Promise.resolve(),
      *[Symbol.iterator]() {},
    };
  }
}

let domReady = false;

/**
 * Convert an Excalidraw diagram to an SVG string at build time.
 * Uses happy-dom to provide browser APIs that @excalidraw/utils needs.
 */
export async function excalidrawToSvg(
  diagram: ExcalidrawFile,
  options: ExcalidrawToSvgOptions = {}
): Promise<string> {
  if (!domReady) {
    setupDomEnvironment();
    domReady = true;
  }

  const { showBackground = false } = options;
  const { exportToSvg } = await import('@excalidraw/utils');

  const data = {
    ...diagram,
    appState: {
      ...diagram.appState,
      exportBackground: showBackground,
    },
    files: null,
  };

  const svg = await exportToSvg(data as any);
  return svg.outerHTML;
}

/**
 * Vite plugin that allows importing .excalidraw files as JSON modules.
 */
export function excalidraw(): Plugin {
  return {
    name: 'vite-plugin-excalidraw',
    load(id) {
      if (id.endsWith('.excalidraw')) {
        const content = fs.readFileSync(id, 'utf-8');
        return `export default ${content};`;
      }
    },
  };
}
