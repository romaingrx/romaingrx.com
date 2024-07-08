import { allArticles, Article } from 'contentlayer/generated';

export async function getSortedArticles({
  tag,
  category,
}: {
  tag?: string;
  category?: string;
}): Promise<Article[]> {
  let articles;
  articles = allArticles.filter(
    (article: Article) => article.status === 'published',
  );
  if (tag) {
    articles = articles.filter((article: Article) =>
      article.tags.map((tag) => tag.name).includes(tag),
    );
  }
  if (category) {
    articles = articles.filter((article: Article) =>
      article.categories.map((category) => category.name).includes(category),
    );
  }
  articles = articles.sort(
    (a: Article, b: Article) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return articles;
}

