import { defineNestedType } from 'contentlayer/source-files';
import URL from './URL';
import Image from './Image';

const Author = defineNestedType(() => ({
  name: 'Author',
  description: 'An author of an article',
  fields: {
    name: {
      type: 'string',
      description: 'The name of the author',
      required: true,
    },
    url: {
      type: 'nested',
      of: URL,
    },
    description: {
      type: 'string',
      description: 'The description of the author',
    },
    avatar: {
      type: 'nested',
      of: Image,
      description: 'The avatar of the author',
      default: {
        src: '/images/authors/default-avatar.jpg',
        alt: 'Author',
      },
    },
  },
}));

export default Author;