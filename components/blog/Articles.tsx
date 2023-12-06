import { ArticleCard } from '@/components/blog/ArticleCard';
import { getSortedArticles } from '@/lib/articles';
import { Article } from 'contentlayer/generated';



export default async function Articles({
  tag,
  category
}: {
  tag?: string;
  category?: string;
}): Promise<JSX.Element> {
  const articles = await getSortedArticles({
    tag,
    category
  });
  if (articles.length === 0) {
    return <div>No articles found.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {articles.map((article: Article) => (
          <div className="p-4" key={article.slug}>
            <a href={`/blog/post/${article.slug}`}>
              <ArticleCard article={article} />
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
