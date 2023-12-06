'use client';

import { Article } from '@/.contentlayer/generated';
import { ArticleCard } from '@/components/blog/ArticleCard';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import LiquidGradient from '@/components/backgrounds/LiquidGradient';
import { toReadableDate } from '@/lib/utils';
import Pill from '@/components/core/Pill';
import Link from 'next/link';

export function BlogPost({
  article,
  index,
}: {
  article: Article;
  index: number;
}) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: target,
    offset: ['start end', 'end start'],
  });

  const [textVisible, setTextVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (progress > 0.1) {
      setTextVisible(true);
    }
  });
  console.log({ index });

  const timing = [0, 0.1, 0.4, 0.7];

  const opacity = useTransform(scrollYProgress, timing, [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, timing, [0.7, 1, 1, 0.7]);
  const y = useTransform(scrollYProgress, timing, [200, 0, 0, -200]);

  const pVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  const px = useTransform(scrollYProgress, timing, [
    '5rem',
    '0rem',
    '0rem',
    '5rem',
  ]);
  const ix = useTransform(scrollYProgress, timing, [
    '-5rem',
    '0rem',
    '0rem',
    '-5rem',
  ]);

  return (
    <motion.div ref={target} className="h-screen">
      <motion.div
        style={{
          opacity,
          y,
          scale,
          x: '-50%',
          width: 'clamp(300px, 100%, 900px)',
        }}
        className="fixed left-1/2 top-1/2 grid grid-cols-2 gap-2  px-4 sm:gap-4 md:gap-8"
      >
        <motion.div
          style={{
            x: ix,
          }}
          className="flex flex-col"
        >
          <div className="relative overflow-hidden rounded-md bg-opacity-70">
            <div className="absolute inset-0 h-full w-full">
              <LiquidGradient />
            </div>
            <div className="relative left-0 top-0 h-full w-full">
              <div className="m-3">
                {article.cover && (
                  <Image
                    src={article.cover.src}
                    alt={article.title}
                    width={512}
                    height={512}
                    className="rounded-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          style={{
            x: px,
          }}
          className="flex h-full flex-col justify-between py-2"
          initial="hidden"
          animate={textVisible ? 'visible' : 'hidden'}
          variants={pVariants}
        >
          <div className="flex flex-col gap-2">
            <motion.span
              variants={textVariants}
              className="font-wise text-3xl text-romaingrx-brand"
            >
              {article.title}
            </motion.span>
            <motion.span variants={textVariants}>
              {article.description}
            </motion.span>
          </div>
          <motion.div
            variants={textVariants}
            className="flex items-center gap-2"
          >
            <span>{toReadableDate(article.date)}</span>
            <Pill variant={'default'}>{article.readingTime.text}</Pill>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function ScrollAnimation({ articles }: { articles: Article[] }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end end'],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.8, 1],
    [0, 1, 1, 0],
  );

  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.95, 1],
    [0, 1, 1, 0],
  );

  return (
    <motion.section ref={targetRef} className="relative mb-[8rem]">
      <motion.div
        style={{ opacity: backgroundOpacity }}
        className="fixed left-0 top-0 h-screen w-screen bg-romaingrx-emphasis pointer-events-none"
      />
      <motion.div className="flex w-full flex-col items-center gap-32">
        <motion.span
          style={{ opacity }}
          className="sticky top-0 pt-32 font-wise text-5xl md:py-48"
        >
          Recent blog posts
        </motion.span>

        <motion.div className="flex flex-col gap-2">
          {articles.map((article, index) => (
            <Link href={`/blog/post/${article.slug}`} key={index}>
              <BlogPost article={article} index={index} />
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
