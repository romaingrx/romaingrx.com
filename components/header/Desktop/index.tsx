'use client';
import DesktopNavigation from './Navigation';
import BlogHeader from './Blog';
import { allArticles } from '@/.contentlayer/generated';
import { usePathname } from 'next/navigation';

type Props = {
  pages: {
    name: string;
    href: string;
  }[];
  className: string;
};

export default function DesktopHeader({
  pages,
  className,
}: Props): JSX.Element {
  const pathname = usePathname();

  if (pathname.startsWith('/blog/post/')) {
    const slug = /blog\/post\/(.*)/.exec(pathname)?.[1];
    const article = allArticles.find((article) => article.slug === slug);
    if (article) {
      return <BlogHeader article={article} />;
    }
  }

  return <DesktopNavigation pages={pages} className={className} />;
}
