import { getCollection as astroGetCollection, type CollectionEntry } from 'astro:content';

export type Author = CollectionEntry<'author'>;
export type BlogPost = CollectionEntry<'blog'>;

export interface BlogPostWithAuthors extends Omit<BlogPost, 'authors'> {
  authors: Author[];
}

export async function getBlogPosts(): Promise<BlogPostWithAuthors[]> {
  const posts = await astroGetCollection('blog');
  const authors = await astroGetCollection('author');

  return await Promise.all(
    posts.map(async post => {
      const postAuthors = await Promise.all(
        post.data.authors.map(async author => {
          const authorData = authors.find(a => a.id === author.id);
          if (!authorData) {
            throw new Error(`Author ${author.id} not found`);
          }
          return authorData;
        })
      );

      return {
        ...post,
        authors: postAuthors,
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
