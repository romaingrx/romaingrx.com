import { allArticles, Article } from 'contentlayer/generated';

async function getSortedArticles(): Promise<Article[]> {
  let articles = await allArticles;
  // articles = articles.filter(
  //   (article: Article) => article.status === 'published',
  // );
  articles = articles.sort(
    (a: Article, b: Article) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return articles;
}

export default async function Blog(): Promise<JSX.Element> {
  const articles = await getSortedArticles();

  return (
    <>
      <h1>Blog</h1>
      {articles.map((article: Article) => (
        <a href={`/blog/post/${article.slug}`} key={article.slug}>
          <div>
            <h2>{article.title}</h2>
          </div>
        </a>
      ))}
    </>
  );
}
