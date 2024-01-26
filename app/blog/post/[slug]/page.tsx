import { allArticles } from '@/.contentlayer/generated';
import Layout from '@/components/core/layout';
import ArticleComponent from '@/components/mdx/Article';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateStaticParams() {
  return allArticles.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params;
  const article = allArticles.find((article) => article.slug === slug);
  if (!article) {
    return {
      title: 'Article not found',
    };
  }
  const { title, description } = article;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title,
    description,
    openGraph: {
      title,
      type: 'article',
      description,
      publishedTime: article.date,
      authors: [article.author.name],
      images: [
        {
          url: `/api/blog/og/${slug}`,
          width: 1200,
          height: 900,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@romaingrx',
      title,
      description,
    },
  };
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
