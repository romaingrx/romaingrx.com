import { visit } from 'unist-util-visit';
// Match all key-value pairs in a string.
const re = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g;

const transformer = (tree : any) => {
  visit(tree, `element`, (node) => {
    let match;

    if (node.tagName === `code` && node.data && node.data.meta) {
      re.lastIndex = 0; // Reset regex.

      while ((match = re.exec(node.data.meta))) {
        node.properties[match[1]] = match[2] || match[3] || match[4] || true;
      }
      node.properties['metastring'] = node.data.meta;
    }
  });
};

const rehypeMetaAsAttributes = () => transformer;

export default rehypeMetaAsAttributes;