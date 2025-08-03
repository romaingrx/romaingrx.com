import path from 'node:path';
import rehypeCitation from 'rehype-citation';

/**
 * Wrapper for rehype-citation that resolves bibliography paths relative to the markdown file
 * instead of the project root. This allows using './references.bib' in frontmatter.
 */
export const rehypeCitationRelative =
  (options = {}) =>
  async (tree, file) => {
    // Get the directory of the current markdown file
    const filePath = file.history[file.history.length - 1];
    const fileDirectory = path.dirname(filePath);

    // Use the file's directory as the base path for resolving bibliography files
    await rehypeCitation({
      path: fileDirectory,
      linkCitations: true,
      csl: 'apa',
      showTooltips: true,
      ...options,
    })(tree, file);
  };
