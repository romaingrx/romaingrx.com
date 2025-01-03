import { defineDocumentType } from 'contentlayer2/source-files';
import readingTime from 'reading-time';
import Tag from './Tag';
import Category from './Category';
import Author from './Author';
import Image from './Image';
import GithubSlugger from 'github-slugger';
import Dataset from './Dataset';

const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: 'content/articles/[^.]**/*.mdx',
  contentType: 'mdx',
  fields: {
    status: {
      type: 'enum',
      options: ['draft', 'published', 'archived'],
      description: 'The status of the article',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date the article was published',
      required: true,
    },
    updated: {
      type: 'date',
      description: 'The date of the update of the article',
      required: false,
    },
    title: {
      type: 'string',
      description: 'The title of the article',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the article',
      required: true,
    },
    author: {
      type: 'nested',
      of: Author,
      description: 'The author of the article',
      required: true,
    },
    tags: {
      type: 'list',
      of: Tag,
      description: 'The tags of the article',
      required: true,
    },
    categories: {
      type: 'list',
      of: Category,
      description: 'The categories of the article',
      required: true,
    },
    cover: {
      type: 'nested',
      of: Image,
      description: 'The cover image of the article',
    },
    github_project: {
      type: 'string',
      description: 'The URL to the GitHub project',
      required: false,
    },
    huggingface_model: {
      type: 'string',
      description: 'The URL to the Hugging Face model',
      required: false,
    },
    datasets: {
      type: 'list',
      of: Dataset,
      description: 'The datasets used in the article',
      required: false,
    },
  },
  computedFields: {
    readingTime: {
      type: 'json',
      description: 'The estimated reading time of the article',
      resolve: (doc) => readingTime(doc.body.raw),
    },
    wordCount: {
      type: 'number',
      description: 'The number of words in the article',
      resolve: (doc) => doc.body.raw.split(/\s+/gu).length,
    },
    slug: {
      type: 'string',
      description: 'The slug of the article',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
    headings: {
      type: 'json',
      resolve: async (doc) => {
        const slugger = new GithubSlugger();
        const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
        const headings = Array.from(doc.body.raw.matchAll(regXHeader)).map(
          ({ groups }) => {
            const flag = groups?.flag;
            const content = groups?.content;
            return {
              level: flag?.length || 0,
              text: content,
              slug: content ? slugger.slug(content) : undefined, // Should probably be a more robust slugger
            };
          },
        );
        return headings;
      },
    },
  },
}));

export default Article;
