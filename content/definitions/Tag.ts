import { defineNestedType } from 'contentlayer/source-files';

const Tag = defineNestedType(() => ({
  name: 'Tag',
  description: 'A tag for categorizing articles',
  fields: {
    name: {
      type: 'string',
      description: 'The name of the tag',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the tag',
    },
  },
}));

export default Tag;
