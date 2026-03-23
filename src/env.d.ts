type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare module "*.excalidraw" {
	import type { ExcalidrawFile } from "@/lib/excalidraw";
	const data: ExcalidrawFile;
	export default data;
}


interface BasecoatInstance {
	register: (name: string, selector: string, init: (el: Element) => void) => void;
	init: (name: string) => void;
	initAll: () => void;
	start: () => void;
	stop: () => void;
}

declare interface Window {
	basecoat: BasecoatInstance;
}

declare namespace App {
	interface Locals extends Runtime {}
}
