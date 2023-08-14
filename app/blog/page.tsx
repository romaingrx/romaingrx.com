import Articles from '@/components/blog/Articles';
import ArticlesPlaceholder from '@/components/skeletons/ArticlesPlaceholder';
import { Suspense } from 'react';

export default async function Blog(): Promise<JSX.Element> {
  return (
    <>
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900 dark:shadow-zinc-800">
        <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-100">
          Blog posts
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          I write about software engineering, AI Safety, and other topics that
          interest me.
        </p>
        <Suspense fallback={<ArticlesPlaceholder n={9} />}>
          <Articles />
        </Suspense>
      </div>
    </>
  );
}
