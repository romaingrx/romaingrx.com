import { defineNestedType } from 'contentlayer/source-files';

const Image = defineNestedType(() => ({
  name: 'Image',
  description: 'An image',
  fields: {
    src: {
      type: 'string',
      description: 'The source of the image',
      required: true,
    },
    alt: {
      type: 'string',
      description: 'The alt text of the image',
      required: false,
    },
    liquidGradientProps: {
      type: 'json',
      description: 'The liquid gradient props of the article cover',
    },
  },
}));

export default Image;
