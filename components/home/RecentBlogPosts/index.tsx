import { getSortedArticles } from '@/lib/articles';
import { ScrollAnimation } from './Animation';

export async function RecentBlogPosts() {
  const articles = await getSortedArticles({});
  if (articles.length === 0) {
    return <div>No articles found.</div>;
  }

  return <ScrollAnimation articles={articles} />;
}
