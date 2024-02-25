import { useMDXComponent } from 'next-contentlayer/hooks';
import { type Article } from '@/.contentlayer/generated';
import Link from 'next/link';
import { default as CoreLink } from '@/components/core/Link';
import { slugify } from '@/lib/utils';
import AuthorCard from './AuthorCard';
import { Tooltip } from '@nextui-org/tooltip';
import { default as _Link } from '../core/Link';
import mdxComponents from './Components';
import Pill from '@/components/core/Pill';
import { ArrowIcon } from '../core/Icon/Icon';
import { VR } from '../core/base';
import { Heading } from '../core';

function localeDateString(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function LinkChip({ text, href }: { text: string; href: string }): JSX.Element {
  return (
    <>
      <Link href={href}>
        <Pill
          variant="default"
          css={{
            cursor: 'pointer',
          }}
        >
          {text}
        </Pill>
      </Link>
    </>
  );
}

function CategoryChip({ category }: { category: string }): JSX.Element {
  return (
    <LinkChip text={category} href={`/blog/category/${slugify(category)}`} />
  );
}

function TagChip({ tag }: { tag: string }): JSX.Element {
  return <LinkChip text={tag} href={`/blog/tag/${slugify(tag)}`} />;
}

function ArticleBody({ article }: { article: Article }): JSX.Element {
  const MDXComponent = useMDXComponent(article.body.code);

  return (
    <>
      <div className="max-w-none break-before-auto">
        <MDXComponent components={mdxComponents} />
      </div>
    </>
  );
}

export default function ArticleComponent({
  article,
}: {
  article: Article;
}): JSX.Element {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
        integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
        crossOrigin="anonymous"
      />
      <div className="mx-auto w-full rounded-lg backdrop-blur-md xl:relative max-w-5xl">
        <article className="flex flex-col">
          <header className="mb-6 flex flex-col gap-2">
            <span className="text-xs text-romaingrx-typeface-secondary">
              <CoreLink
                href="/blog"
                variant="none"
                startIcon={<ArrowIcon angle={180} />}
              >
                Back to blog
              </CoreLink>
            </span>
            <div className="flex flex-col gap-1">
              <Heading size={'4'} className="font-semibold">
                {article.title}
              </Heading>
              <div className="flex items-baseline gap-2">
                <time
                  className="text-sm text-zinc-500"
                  dateTime={localeDateString(article.date)}
                >
                  {localeDateString(article.date)}
                </time>
                <VR />
                <Tooltip
                  content={`${article.readingTime.words} words`}
                  placement={'bottom'}
                  delay={0}
                  closeDelay={0}
                >
                  <span className="text-sm text-zinc-500">
                    {article.readingTime.text}
                  </span>
                </Tooltip>
              </div>
            </div>
          </header>
          <ArticleBody article={article} />
          <footer className="mt-6 flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <TagChip key={tag.name} tag={tag.name} />
                ))}
              </div>
              <div className="flex gap-2"></div>
            </div>
            <AuthorCard author={article.author} />
          </footer>
        </article>
      </div>
    </>
  );
}
