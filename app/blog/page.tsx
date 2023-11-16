import { Transition } from '@/components/backgrounds/PixelBackground';
import Articles from '@/components/blog/Articles';
import Layout from '@/components/core/layout';
import ArticlesPlaceholder from '@/components/skeletons/ArticlesPlaceholder';
import { Suspense } from 'react';

export default async function Blog(): Promise<JSX.Element> {
  return (
    <>
      <Transition>
        <Layout>
          <h1 className="text-4xl font-bold">
            Blog posts
          </h1>
          <p>
            I write about software engineering, AI Safety, and other topics that
            interest me.
          </p>
          <Suspense fallback={<ArticlesPlaceholder n={9} />}>
            <Articles />
          </Suspense>
        </Layout>
      </Transition>
    </>
  );
}
