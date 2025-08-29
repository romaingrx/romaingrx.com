import path from "node:path";
import rehypeCitation from "rehype-citation";

/**
 * Wrapper for rehype-citation that resolves bibliography paths relative to the markdown file
 * instead of the project root. This allows using './references.bib' in frontmatter.
 *
 * Provides enhanced styling options and better visual integration with the design system.
 * Supports reading citation style preferences from frontmatter.
 */
export const rehypeCitationRelative =
	(options = {}) =>
	async (tree, file) => {
		// Get the directory of the current markdown file
		const filePath = file.history[file.history.length - 1];
		const fileDirectory = path.dirname(filePath);

		// Extract frontmatter data if available
		const frontmatter = file.data.astro?.frontmatter || {};

		// Allow frontmatter to override citation style
		const cslStyle = frontmatter.csl || options.csl || "apa";
		const citationStyle =
			frontmatter.citationStyle || options.citationStyle || "default";

		// Style variants
		const styleVariants = {
			default: {
				inlineClass: [
					"citation-inline",
					"text-primary",
					"hover:text-accent",
					"font-medium",
					"transition-all",
					"duration-200",
				],
				inlineBibClass: ["citation-bibliography", "references-section"],
			},
			minimal: {
				inlineClass: [
					"text-sm",
					"text-muted-foreground",
					"hover:text-foreground",
					"transition-colors",
				],
				inlineBibClass: [
					"text-sm",
					"space-y-2",
					"mt-8",
					"border-t",
					"border-border",
					"pt-6",
				],
			},
			academic: {
				inlineClass: [
					"citation-inline",
					"text-xs",
					"text-muted-foreground",
					"font-mono",
					"hover:text-foreground",
				],
				inlineBibClass: [
					"text-xs",
					"font-mono",
					"space-y-3",
					"mt-10",
					"border-t-2",
					"border-border",
					"pt-8",
				],
			},
		};

		// Default configuration with custom styling
		const defaultConfig = {
			path: fileDirectory,
			linkCitations: true,
			csl: cslStyle,
			showTooltips: true,
			tooltipAttribute: "title",
			...(styleVariants[citationStyle] || styleVariants.default),
		};

		// Use the file's directory as the base path for resolving bibliography files
		await rehypeCitation({
			...defaultConfig,
			...options,
		})(tree, file);
	};

/**
 * Alternative citation wrapper with different styling options
 * for more minimal or academic styling
 */
export const rehypeCitationMinimal =
	(options = {}) =>
	async (tree, file) => {
		const filePath = file.history[file.history.length - 1];
		const fileDirectory = path.dirname(filePath);

		await rehypeCitation({
			path: fileDirectory,
			linkCitations: true,
			csl: "chicago", // Different default style
			showTooltips: false,
			inlineClass: [
				"text-sm",
				"text-muted-foreground",
				"hover:text-foreground",
			],
			inlineBibClass: ["text-sm", "space-y-2", "mt-8"],
			...options,
		})(tree, file);
	};
