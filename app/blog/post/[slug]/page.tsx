import { allArticles } from '@/.contentlayer/generated';
import Layout from '@/components/layout';
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
      <Layout>
        <ArticleComponent article={article} />
      </Layout>
    </>
  );
}
