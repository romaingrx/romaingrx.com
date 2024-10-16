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
import { FaDatabase } from 'react-icons/fa';
import ResourceCards from './ResourceCards';
import { FaLink } from 'react-icons/fa';
import { Button as ShadcnButton } from '@/components/ui/button';
import { AuthorPreview } from './AuthorPreview';

function ArticleHeader({ article }: { article: Article }): JSX.Element {
  return (
    <header className="flex flex-col gap-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-polysans text-4xl font-bold md:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        <span className="text-romaingrx-typeface-secondary">
          {article.description}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-medium text-romaingrx-typeface-secondary">
              Published
            </h2>
            <time dateTime={article.date} className="text-base">
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {article.updated && (
              <div className="flex items-center gap-2 rounded-md bg-romaingrx-emphasis p-1">
                <span className="text-romaingrx-brand">Updated on</span>
                <time dateTime={article.updated} className="text-base">
                  {new Date(article.updated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-medium text-romaingrx-typeface-secondary">
              Time to read
            </h2>
            <Tooltip content={`${article.readingTime.words} words`}>
            <span className="text-base">
              {Math.ceil(article.readingTime.minutes)} min read
            </span>
            </Tooltip>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-medium text-romaingrx-typeface-secondary">
              Author
            </h2>
            <AuthorPreview author={article.author} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="mb-2 text-sm font-medium text-romaingrx-typeface-secondary">
            Resources
          </h2>
          <div className="flex items-end gap-3">
            <ResourceCards
              githubProject={article.github_project}
              huggingfaceModel={article.huggingface_model}
              datasets={article.datasets}
            />
          </div>
        </div>
      </div>
    </header>
  );
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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-0">
      <article className="flex w-full flex-col gap-6">
        <ArticleHeader article={article} />

        <hr className="border-t border-romaingrx-brand opacity-20" />

        <ArticleBody article={article} />

        <hr className="border-t border-romaingrx-brand opacity-20" />

        <footer className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <div className="hidden flex-col gap-4">
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
  );
}
