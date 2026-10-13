type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare module "*.excalidraw" {
	import type { ExcalidrawFile } from "@/lib/excalidraw";
	const data: ExcalidrawFile;
	export default data;
}


declare namespace App {
	interface Locals extends Runtime {}
}
