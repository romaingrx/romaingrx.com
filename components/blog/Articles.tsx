import { getSortedArticles } from '@/lib/articles';
import ArticlesGrid from './ArticlesGrid';

export default async function Articles({
  tag,
  category,
}: {
  tag?: string;
  category?: string;
}): Promise<JSX.Element> {
  const articles = await getSortedArticles({
    tag,
    category,
  });

  if (articles.length === 0) {
    return <div>No articles found.</div>;
  }

  return <ArticlesGrid articles={articles} />;
}
