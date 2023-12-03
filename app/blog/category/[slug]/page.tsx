import { Transition } from '@/components/backgrounds/PixelBackground';
import Articles from '@/components/blog/Articles';
import Layout from '@/components/core/layout';
import ArticlesPlaceholder from '@/components/skeletons/ArticlesPlaceholder';
import { Suspense } from 'react';

export default function CategoryBlogPage({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}): JSX.Element {
  return (
    <>
      <Transition>
        <Layout>
          <h1 className="text-4xl font-bold">
            Blog posts in category <b>{slug}</b>
          </h1>
          <Suspense fallback={<ArticlesPlaceholder n={9} />}>
            <Articles category={slug} />
          </Suspense>
        </Layout>
      </Transition>
    </>
  );
}
