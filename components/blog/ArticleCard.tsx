'use client';
import { Article } from '@/.contentlayer/generated';
import { Card, CardBody, Chip } from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import LiquidGradient from '../backgrounds/LiquidGradient';
import { toReadableDate } from '@/lib/utils';

export function ArticleCard({ article }: { article: Article }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardBody className={clsx('p-0')}>
        <div
          className={clsx(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform',
            isHovered ? 'z-10' : 'hidden',
          )}
        >
          <Chip color="secondary">Go to article →</Chip>
        </div>
        <div className={clsx('flex flex-col', isHovered && 'blur-sm')}>
          {article.cover && (
            <div className="relative left-0 top-0 h-4/5 w-full bg-opacity-70">
              <div className="absolute inset-0 h-full w-full" id="test">
                <LiquidGradient />
              </div>
              <div className="relative left-0 top-0 h-full w-full">
                <div className="m-3">
                  <Image
                    src={article.cover.src}
                    alt={article.title}
                    width={1024}
                    height={1024}
                    className="rounded-sm"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1 p-3">
            <h2 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-2xl">
              {article.title}
            </h2>
            <span className="text-zinc-800 dark:text-zinc-100">
              {article.description}
            </span>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                {toReadableDate(article.date)}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-300">
                {article.readingTime.text}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
