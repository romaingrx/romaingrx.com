import Articles from '@/components/blog/Articles';
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
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900 dark:shadow-zinc-800">
        <h1 className="mb-2 text-4xl font-bold text-zinc-800 dark:text-zinc-100">
          Blog posts in category
          <span className="italic text-bob-500 dark:text-bob-400"> {slug}</span>
        </h1>
        <Suspense fallback={<ArticlesPlaceholder n={9} />}>
          <Articles category={slug} />
        </Suspense>
      </div>
    </>
  );
}
