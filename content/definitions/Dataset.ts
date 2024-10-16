import { defineNestedType } from 'contentlayer2/source-files';

const Dataset = defineNestedType(() => ({
  name: 'Dataset',
  description: 'A dataset',
  fields: {
    name: {
      type: 'string',
      description: 'The name of the dataset',
      required: true,
    },
    link: {
      type: 'string',
      description: 'The link to the dataset',
      required: false,
    },
    provenance: {
      type: 'string',
      description: 'The provenance of the dataset',
      required: false,
    },
    description: {
      type: 'string',
      description: 'The description of the dataset',
      required: false,
    },
  },
}));

export default Dataset;