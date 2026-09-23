type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare module "*.excalidraw" {
	import type { ExcalidrawFile } from "@/lib/excalidraw";
	const data: ExcalidrawFile;
	export default data;
}


declare interface Window {
  themeController?: ThemeController;
}

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
}

interface ThemeController {
  getState: () => ThemeState;
  setTheme: (preference: ThemePreference) => void;
  cycleTheme: () => void;
  refresh: () => void;
  subscribe: (listener: (state: ThemeState) => void) => () => boolean;
}

declare namespace App {
	interface Locals extends Runtime {}
}
