'use client';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { type Article } from '@/.contentlayer/generated';
import Link from 'next/link';
import { default as CoreLink } from '@/components/core/Link';
import AuthorCard from './AuthorCard';
import { Tooltip } from '@nextui-org/tooltip';
import { default as _Link } from '../core/Link';
import mdxComponents from './Components';
import Pill from '@/components/core/Pill';
import { ArrowIcon, GithubIcon, HuggingFaceIcon } from '../core/Icon/Icon';
import 'katex/dist/katex.min.css';
import { useQuery } from '@tanstack/react-query';
import { get_next_article, get_prev_article } from '@/lib/articles/related';
import { to_article_metadata } from '@/lib/articles/utils';
import { Button, Card } from '../core';
import { CardBody } from '@nextui-org/react';

function localeDateString(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
  const { data: previousArticle, isLoading: previousArticleLoading } = useQuery(
    {
      queryKey: ['previousArticle', article.slug],
      queryFn: () => get_prev_article(to_article_metadata(article)),
    },
  );
  const { data: nextArticle, isLoading: nextArticleLoading } = useQuery({
    queryKey: ['nextArticle', article.slug],
    queryFn: () => get_next_article(to_article_metadata(article)),
  });

  console.log(previousArticle, nextArticle);
  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-lg backdrop-blur-md xl:relative">
        <article className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span className="text-xs text-romaingrx-typeface-secondary">
              <CoreLink
                href="/blog"
                variant="none"
                startIcon={<ArrowIcon angle={180} />}
              >
                Back to blog
              </CoreLink>
            </span>
            <div className="flex w-fit flex-col items-center gap-4 py-4">
              <div className="flex flex-col gap-4">
                <h1 className="font-polysans text-xl font-semibold md:text-5xl">
                  {article.title}
                </h1>
                <div className="flex w-full justify-between gap-8 text-right">
                  <div className="flex flex-col items-start gap-4 md:flex-row md:gap-8">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-semibold">Written by</span>
                      <AuthorCard author={article.author} />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-semibold">
                        Published on
                      </span>
                      <time
                        className="text-sm text-default-500"
                        dateTime={localeDateString(article.date)}
                      >
                        {localeDateString(article.date)}
                      </time>
                    </div>
                    {article.updated && (
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-semibold">
                          Updated on
                        </span>
                        <time
                          className="text-sm text-default-500"
                          dateTime={localeDateString(article.date)}
                        >
                          {localeDateString(article.date)}
                        </time>
                      </div>
                    )}
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-semibold">
                        Reading time
                      </span>
                      <Tooltip
                        content={`${article.readingTime.words} words`}
                        placement={'bottom'}
                        delay={0}
                        closeDelay={0}
                      >
                        <span className="text-sm text-default-500">
                          {article.readingTime.text}
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <hr className="mx-auto h-[0.25rem] w-2/3 rounded-full bg-romaingrx-brand opacity-10" />
          <ArticleBody article={article} />
          <hr className="mx-auto h-[0.25rem] w-2/3 rounded-full bg-romaingrx-brand opacity-10" />
          <footer className="flex flex-col gap-2">
            <div className="flex gap-4">
              {article.github_project && (
                <Link href={article.github_project}>
                  <Card depth={1} glass className="w-fit">
                    <CardBody>
                      <div className="flex gap-2">
                        <GithubIcon className="h-4 w-4 p-[0.125rem]" />
                        <span>View code on GitHub</span>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              )}
              {article.huggingface_model && (
                <Link href={article.huggingface_model}>
                  <Card depth={1} glass className="w-fit">
                    <CardBody>
                      <div className="flex gap-2">
                        <HuggingFaceIcon className="h-4 w-4" />
                        <span>View model on Hugging Face</span>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex-col gap-4 hidden">
                <h1 className="font-polysans text-lg font-semibold md:text-3xl">
                  Written by
                </h1>
                <AuthorCard author={article.author} type="description" />
              </div>
              <div className="flex flex-col gap-2">
                {!(previousArticle || nextArticle) && (
                  <CoreLink
                    href="/blog"
                    variant="none"
                    startIcon={<ArrowIcon angle={180} />}
                  >
                    View all articles
                  </CoreLink>
                )}
                {(previousArticle || nextArticle) && (
                  <h1 className="font-polysans text-lg font-semibold md:text-3xl">
                    Related articles
                  </h1>
                )}
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  {previousArticle && (
                    <Link href={`/blog/post/${previousArticle?.slug}`}>
                      <div className="group flex w-full items-start gap-2 rounded-lg p-2 transition-all duration-300">
                        <ArrowIcon
                          angle={180}
                          className="flex-shrink-0 transition-all duration-300 group-hover:-translate-x-1"
                        />
                        <div className="flex flex-col gap-2">
                          <span className="font-polysans text-xl">
                            {previousArticle?.title}
                          </span>
                          <span className="text-sm text-romaingrx-typeface-secondary">
                            {previousArticle?.description}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                <div className="flex-1 text-right">
                  {nextArticle && (
                    <Link href={`/blog/post/${nextArticle?.slug}`}>
                      <div className="group flex w-full items-start gap-2 rounded-lg p-2 transition-all duration-300">
                        <div className="flex flex-col gap-2">
                          <span className="font-polysans text-xl">
                            {nextArticle?.title}
                          </span>
                          <span className="text-sm text-romaingrx-typeface-secondary">
                            {nextArticle?.description}
                          </span>
                        </div>
                        <ArrowIcon
                          angle={0}
                          className="flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
                        />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
