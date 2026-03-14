import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Plugin } from 'vite';

const require = createRequire(import.meta.url);

// Resolve paths for @excalidraw/utils and its font assets
const excalidrawUtilsPath = require.resolve('@excalidraw/utils');
const excalidrawDistDir = path.dirname(excalidrawUtilsPath);

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
 * Convert an Excalidraw diagram to an SVG string at build time.
 * Serves the @excalidraw/utils bundle and font assets via a local HTTP server
 * so that Playwright can resolve fonts correctly.
 */
export async function excalidrawToSvg(
  diagram: ExcalidrawFile,
  options: ExcalidrawToSvgOptions = {}
): Promise<string> {
  const { showBackground = false } = options;
  const { chromium } = await import('playwright');
  const http = await import('node:http');

  // Serve the excalidraw dist directory (JS bundle + font assets) over HTTP
  // so that Playwright has a proper origin for module imports and font loading
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');

    if (url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body></body></html>');
      return;
    }

    const filePath = path.join(excalidrawDistDir, url.pathname);
    if (!filePath.startsWith(excalidrawDistDir)) {
      res.writeHead(403);
      res.end();
      return;
    }

    try {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.js': 'application/javascript',
        '.ttf': 'font/ttf',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
      };
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] ?? 'application/octet-stream',
      });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address() as import('node:net').AddressInfo;
  const baseUrl = `http://127.0.0.1:${addr.port}`;

  const diagramWithOptions = {
    ...diagram,
    appState: {
      ...diagram.appState,
      exportBackground: showBackground,
    },
    files: null,
  };

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseUrl);

  // Use page.addScriptTag with inline content to load the module and expose
  // exportToSvg on window. We avoid using import() in page.evaluate because
  // Vite's SSR transform rewrites it to __vite_ssr_dynamic_import__.
  await page.addScriptTag({
    type: 'module',
    content: `import { exportToSvg } from "/index.js"; window.__exportToSvg = exportToSvg;`,
  });
  await page.waitForFunction(() => '__exportToSvg' in window);

  const svgString = await page.evaluate(async (data) => {
    const svg = await (window as any).__exportToSvg(data);
    return svg.outerHTML as string;
  }, diagramWithOptions);

  await browser.close();
  server.close();
  return svgString;
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
