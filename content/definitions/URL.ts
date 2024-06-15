import { defineNestedType } from 'contentlayer2/source-files';

const URL = defineNestedType(() => ({
  name: 'URL',
  description: 'A URL',
  fields: {
    name: {
      type: 'string',
      description: 'The name of the website the URL points to',
      required: false,
    },
    url: {
      type: 'string',
      description: 'The URL',
      required: true,
    },
  },
}));

export default URL;
