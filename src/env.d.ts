type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare module "*.excalidraw" {
	import type { ExcalidrawFile } from "@/lib/excalidraw";
	const data: ExcalidrawFile;
	export default data;
}


/** One top-level key of a JSON file, see src/lib/json-pick.ts. */
declare module "*&pick" {
	const value: unknown;
	export default value;
}

declare namespace App {
	interface Locals extends Runtime {}
}
