import { getCollection as astroGetCollection, render, type CollectionEntry } from 'astro:content';

import { slugify } from './utils';

export type Author = CollectionEntry<'author'>;
export type BlogPost = CollectionEntry<'blog'>;
export type Note = CollectionEntry<'note'>;

export interface BlogPostWithAuthors extends Omit<BlogPost, 'authors'> {
  authors: Author[];
  readingTime: string;
  slug: string;
}

export interface NoteWithAuthors extends Omit<Note, 'authors'> {
  authors: Author[];
  readingTime: string;
  slug: string;
}

export async function getBlogPosts(): Promise<BlogPostWithAuthors[]> {
  const posts = await astroGetCollection('blog');
  const authors = await astroGetCollection('author');

  return await Promise.all(
    posts.map(async (post: BlogPost) => {
      const { remarkPluginFrontmatter } = await render(post);
      const postAuthors = await Promise.all(
        post.data.authors.map(async (author: { id: string }) => {
          const authorData = authors.find((a: Author) => a.id === author.id);
          if (!authorData) {
            throw new Error(`Author ${author.id} not found`);
          }
          return authorData;
        })
      );

      return {
        ...post,
        authors: postAuthors,
        readingTime: remarkPluginFrontmatter?.minutesRead || '1 min read',
        slug: slugify(post.data.title),
      };
    })
  );
}

export async function getPublishedBlogPosts(): Promise<BlogPostWithAuthors[]> {
  const posts = await getBlogPosts();
  return posts
    .filter(post => post.data.status === 'published')
    .sort((a, b) => b.data.published_date.getTime() - a.data.published_date.getTime());
}

export async function getAuthors(): Promise<Author[]> {
  return await astroGetCollection('author');
}

export async function getNotes(): Promise<NoteWithAuthors[]> {
  const notes = await astroGetCollection('note');
  const authors = await astroGetCollection('author');

  return await Promise.all(
    notes.map(async (note: Note) => {
      const { remarkPluginFrontmatter } = await render(note);
      const noteAuthors = await Promise.all(
        note.data.authors.map(async (author: { id: string }) => {
          const authorData = authors.find((a: Author) => a.id === author.id);
          if (!authorData) {
            throw new Error(`Author ${author.id} not found`);
          }
          return authorData;
        })
      );

      return {
        ...note,
        authors: noteAuthors,
        readingTime: remarkPluginFrontmatter?.minutesRead || '1 min read',
        slug: slugify(note.data.title),
      };
    })
  );
}

export async function getPublishedNotes(): Promise<NoteWithAuthors[]> {
  const notes = await getNotes();
  return notes
    .filter(note => note.data.status === 'published')
    .sort((a, b) => b.data.published_date.getTime() - a.data.published_date.getTime());
}
