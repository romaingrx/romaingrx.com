import { defineNestedType } from 'contentlayer/source-files';

const Category = defineNestedType(() => ({
  name: 'Category',
  description: 'A category for categorizing articles',
  fields: {
    name: {
      type: 'string',
      description: 'The name of the category',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the category',
    },
  },
}));

export default Category;