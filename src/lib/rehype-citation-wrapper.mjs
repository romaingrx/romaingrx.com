import path from "node:path";
import rehypeCitation from "rehype-citation";

/**
 * Enhanced rehype-citation wrapper with automatic References heading generation
 * and improved styling integration with the design system.
 *
 * Features:
 * - Resolves bibliography paths relative to markdown file
 * - Automatically adds "References" heading when bibliography is present
 * - Supports multiple citation styles via frontmatter
 * - Clean, compact bibliography styling
 */
export const rehypeCitationRelative =
	(options = {}) =>
	async (tree, file) => {
		const filePath = file.history[file.history.length - 1];
		const fileDirectory = path.dirname(filePath);
		const frontmatter = file.data.astro?.frontmatter || {};

		// Skip if no bibliography is specified
		if (!frontmatter.bibliography) {
			return;
		}

		// Add References heading to the tree before processing citations
		addReferencesHeading(tree);

		// Citation style configuration
		const cslStyle = frontmatter.csl || options.csl || "apa";
		const citationStyle =
			frontmatter.citationStyle || options.citationStyle || "default";

		// Predefined style variants
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
			},
			minimal: {
				inlineClass: [
					"text-sm",
					"text-muted-foreground",
					"hover:text-foreground",
					"transition-colors",
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
			},
		};

		// Configure rehype-citation
		const config = {
			path: fileDirectory,
			linkCitations: true,
			csl: cslStyle,
			showTooltips: true,
			tooltipAttribute: "title",
			inlineBibClass: [], // Disable inline bibliography
			...(styleVariants[citationStyle] || styleVariants.default),
			...options,
		};

		await rehypeCitation(config)(tree, file);
	};

/**
 * Adds a "References" heading to the end of the document tree
 */
function addReferencesHeading(tree) {
	const referencesHeading = {
		type: "element",
		tagName: "h1",
		properties: {
			id: "references",
			className: ["references-heading"],
		},
		children: [
			{
				type: "text",
				value: "References",
			},
		],
	};

	tree.children.push(referencesHeading);
}
