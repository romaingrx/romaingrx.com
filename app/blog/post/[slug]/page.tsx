import { allArticles } from '@/.contentlayer/generated';
import ArticleComponent from '@/components/mdx/Article';

export async function generateStaticParams() {
  return allArticles.map((post) => ({
    slug: post.slug,
  }));
}

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
    <div className="mt-8 p-16 max-w-6xl mx-auto rounded-lg shadow-md dark:shadow-zinc-800 bg-white dark:bg-zinc-900">
      <ArticleComponent article={article} />
    </div>
    </>
  );
}
