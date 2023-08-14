'use client';
import { Article } from '@/.contentlayer/generated';
import { Card, CardBody } from '@nextui-org/react';
import Image from 'next/image';

function toReadableDate(date: string) {
  const d = new Date(date);
  const diff = new Date().getTime() - d.getTime();
  // If less than five days ago, return "X days ago"
  if (diff < 432000000) {
    return `${Math.floor(diff / 86400000)} days ago`;
  }
  // Otherwise, return "Month Day, Year"
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card isHoverable>
      <CardBody className="p-0">
        {article.cover && (
          <div className="relative left-0 top-0 h-4/5 w-full bg-opacity-70 bg-gradient-to-br from-bob-400 from-60% to-white dark:from-bob-500 dark:to-zinc-900">
            <div className="m-3">
              <Image
                src={article.cover.src}
                alt={article.title}
                width={1024}
                height={1024}
              />
            </div>
          </div>
        )}
        <div className="gap-1 flex flex-col p-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-2xl">
            {article.title}
          </h2>
          <span className="text-zinc-800 dark:text-zinc-100">
            {article.description}
          </span>
          <span className="text-zinc-600 dark:text-zinc-300 text-sm">
            {toReadableDate(article.date)}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
