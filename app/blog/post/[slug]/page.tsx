import { allArticles } from '@/.contentlayer/generated';
import ArticleComponent from '@/components/mdx/Article';

export default function BlogPostPage({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}): JSX.Element {
  const article = allArticles.find((article) => article.slug === slug);

  if (!article) {
    return <div>Article not found</div>;
  }
  return (
    <>
    <div className="mt-8 p-16 max-w-6xl mx-auto rounded-lg shadow-md bg-white dark:bg-black">
      <ArticleComponent article={article} />
    </div>
    </>
  );
}
