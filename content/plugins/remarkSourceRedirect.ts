/**
 * remark-assets-src-redirect.js
 *
 * Requires:
 * - npm i image-size unist-util-visit
 */
import { visit } from 'unist-util-visit';
import fs from 'fs';
import pathModule from 'path';

type Options = {
  public_root: string | undefined;
};

/**
 * Analyzes local markdown/MDX images & videos and rewrites their `src`.
 * Supports both markdown-style images, MDX <Image /> components, and `source`
 * elements. Can be easily adapted to support other sources too.
 * @param {string} options.root - The root path when reading the image file.
 */
const remarkSourceRedirect = (
  options: Options = {
    public_root: undefined,
  },
) => {
  return (tree: any, file: any) => {
    // You need to grab a reference of your post's slug.
    // I'm using Contentlayer (https://www.contentlayer.dev/), which makes it
    // available under `file.data`.But if you're using something different, you
    // should be able to access it under `file.path`, or pass it as a parameter
    // the the plugin `options`.
    const [slug] = file.data.rawDocumentData.flattenedPath.split('/').reverse();
    const copyImageSrcToPublic = (url: string) => {
      if (url.startsWith('absolute:')){
        return url.replace(/^absolute:/, '');
      }
      const redirectedUrl = `${
        options.public_root || '/blog-assets'
      }/${slug}/${url}`;

      const path = `${file.dirname}/${url}`;
      if (!fs.existsSync(path)) {
        throw new Error(
          `You referenced an image in your markdown/MDX file that doesn't exist: ${path}`,
        );
      }
      const publicPath = `${process.env.PWD}/public/${redirectedUrl}`;
      const dirname = pathModule.dirname(publicPath);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }
      if (path !== publicPath) {
        fs.copyFileSync(path, publicPath);
      }
      return redirectedUrl;
    };
    // This matches all images that use the markdown standard format ![label](path).
    visit(tree, 'paragraph', (node: any) => {
      const image = node.children.find((child: any) => child.type === 'image');
      if (image) {
        console.log(image.url);
        const redirectedSrc = copyImageSrcToPublic(image.url);
        image.url = redirectedSrc;
      }
    });
    // This matches all MDX' <Image /> components & source elements that I'm
    // using within a custom <Video /> component.
    // Feel free to update it if you're using a different component name.
    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'Image' || node.name === 'source') {
        const srcAttr = node.attributes.find(
          (attribute: any) => attribute.name === 'src',
        );
        if (srcAttr) {
          const redirectedSrc = copyImageSrcToPublic(srcAttr.value);
          srcAttr.value = redirectedSrc;
        }
      }
    });
  }
};

export default remarkSourceRedirect;
