'use client';
import { Article } from '@/.contentlayer/generated';
import { Card } from '../core';
import { CardBody } from '@nextui-org/card';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import LiquidGradient from '../backgrounds/LiquidGradient';
import { toReadableDate } from '@/lib/utils';
import ArticleCoverWithBg from './ArticleCover';

export function ArticleCard({ article }: { article: Article }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      depth={isHovered ? 3 : 0}
      isPressable
    >
      <CardBody className={clsx('p-0')}>
        <div className={clsx('flex flex-col')}>
          <ArticleCoverWithBg article={article} />
          <div className="flex h-48 flex-col gap-1 p-3">
            <h2 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-2xl">
              {article.title}
            </h2>
            <ScrollShadow hideScrollBar>
              <span className="text-zinc-800 dark:text-zinc-100">
                {article.description}
              </span>
            </ScrollShadow>
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
