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
import { Button, H1, Heading } from '../core';
import 'katex/dist/katex.min.css';

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

function TagChip({ tag }: { tag: string }): JSX.Element {
  return <LinkChip text={tag} href={`/blog/tag/${slugify(tag)}`} />;
}

function ArticleBody({ article }: { article: Article }): JSX.Element {
  const MDXComponent = useMDXComponent(article.body.code);

  return (
    <>
      <div className="flex max-w-none break-before-auto flex-col gap-4">
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
      <div className="mx-auto w-full max-w-5xl rounded-lg backdrop-blur-md xl:relative">
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
            <div className="flex w-full flex-col items-center justify-center gap-4 py-4">
              <div className="align-start flex flex-col gap-2">
                <h1 className="mx-auto font-polysans text-5xl font-semibold">
                  {article.title}
                </h1>
                <div className="flex w-full max-w-2xl justify-between">
                  <AuthorCard author={article.author} />
                  <div className="flex flex-col items-baseline justify-start my-auto">
                    <time
                      className="text-sm text-default-500"
                      dateTime={localeDateString(article.date)}
                    >
                      {localeDateString(article.date)}
                    </time>
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
              </div>
            </div>
            <div className="flex flex-col gap-1"></div>
            <hr className="mx-auto w-2/3 border-romaingrx-brand opacity-10" />
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
