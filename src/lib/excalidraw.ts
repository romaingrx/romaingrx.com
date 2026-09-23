import { Window } from 'happy-dom';
import fs from 'node:fs';

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
  const win = new Window({ url: 'http://localhost' });
  Object.defineProperty(win, 'devicePixelRatio', { value: 1 });

  class FontFaceStub {
    status = 'loaded';
    unicodeRange = '';

    constructor(readonly family: string) {}

    async load() {
      return this;
    }
  }

  Object.defineProperty(win.document, 'fonts', {
    value: {
      add() {},
      check() {
        return true;
      },
      ready: Promise.resolve(),
      *[Symbol.iterator]() {},
    },
  });

  // @excalidraw/utils reads these browser globals at module initialization.
  Object.defineProperties(globalThis, {
    window: { configurable: true, value: win },
    document: { configurable: true, value: win.document },
    navigator: { configurable: true, value: win.navigator },
    devicePixelRatio: { configurable: true, value: 1 },
    HTMLCanvasElement: { configurable: true, value: win.HTMLCanvasElement },
    Image: { configurable: true, value: win.Image },
    FontFace: { configurable: true, value: FontFaceStub },
  });
}

let domReady = false;

/**
 * Convert an Excalidraw diagram to an SVG string at build time.
 * Uses happy-dom to provide browser APIs that @excalidraw/utils needs.
 */
export async function excalidrawToSvg(
  diagram: ExcalidrawFile,
  options: ExcalidrawToSvgOptions = {},
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

  const svg = await exportToSvg(data as Parameters<typeof exportToSvg>[0]);
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
