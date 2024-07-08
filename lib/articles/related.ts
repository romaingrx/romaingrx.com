'use server';

import { allArticles, Article } from 'contentlayer/generated';
import { ArticleMetadata, to_article_metadata } from './utils';

export async function get_prev_article(article: ArticleMetadata): Promise<ArticleMetadata | null> {
  // Naive based on date
  const articles = allArticles
    .filter(
      (a: Article) =>
        a.status === 'published' &&
        new Date(a.date).getTime() < new Date(article.date).getTime(),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles.length > 0 ? to_article_metadata(articles[0]) : null;
}

export async function get_next_article(
  article: ArticleMetadata,
): Promise<ArticleMetadata | null> {
  // Naive based on date
  const articles = allArticles
    .filter(
      (a: Article) =>
        a.status === 'published' &&
        new Date(a.date).getTime() > new Date(article.date).getTime(),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return articles.length > 0 ? to_article_metadata(articles[0]) : null;
}
