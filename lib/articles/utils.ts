import { Article } from "@/.contentlayer/generated";

export type ArticleMetadata = Pick<Article, 'slug' | 'date' | 'status' | 'title' | 'description'>;
export function to_article_metadata(article: Article): ArticleMetadata {
  return {
    slug: article.slug,
    date: article.date,
    status: article.status,
    title: article.title,
    description: article.description,
  };
}