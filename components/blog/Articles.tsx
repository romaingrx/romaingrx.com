import { ArticleCard } from '@/components/blog/ArticleCard';
import { allArticles, Article } from 'contentlayer/generated';

async function getSortedArticles({
  tag,
  category
}:{
  tag?: string;
  category?: string;
}): Promise<Article[]> {
  let articles;
  articles = allArticles.filter(
    (article: Article) => article.status === 'published',
  );
  if (tag){
    articles = articles.filter((article: Article) => article.tags.map(tag => tag.name).includes(tag))
  }
  if (category){
    articles = articles.filter((article: Article) => article.categories.map(category => category.name).includes(category))
  }
  articles = articles.sort(
    (a: Article, b: Article) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return articles;
}

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
