'use client';

import { Article } from '@/.contentlayer/generated';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import LiquidGradient from '@/components/backgrounds/LiquidGradient';
import { toReadableDate } from '@/lib/utils';
import Pill from '@/components/core/Pill';
import Link from 'next/link';
import { clsx } from 'clsx';
import { springConfigs } from '@/components/core/constants';

export function BlogPost({
  article,
  index,
}: {
  article: Article;
  index: number;
}) {
  const target = useRef<HTMLDivElement>(null);
  let { scrollYProgress } = useScroll({
    target: target,
    offset: ['start end', 'end start'],
  });

  scrollYProgress = useSpring(scrollYProgress, springConfigs.scroll);

  const [textVisible, setTextVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (progress > 0.1) {
      setTextVisible(true);
    }
  });

  const timing = [0, 0.1, 0.4, 0.6];

  const opacity = useTransform(scrollYProgress, timing, [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, timing, [0.7, 1, 1, 0.7]);
  const y = useTransform(scrollYProgress, timing, [
    '75%',
    '-50%',
    '-50%',
    '-75%',
  ]);

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

  return (
    <motion.div ref={target} className="h-screen">
      <motion.div
        style={{
          opacity,
          scale,
          y,
          x: '-50%',
          width: 'clamp(300px, 100%, 900px)',
        }}
        className={clsx(
          'fixed left-1/2 top-1/2 grid',
          'grid-cols-1 grid-rows-[2fr,1fr] px-8',
          'md:grid-cols-[1fr,1fr] md:grid-rows-1 md:gap-4 md:px-4',
        )}
      >
        <motion.div className="flex flex-col">
          <div className="relative overflow-hidden rounded-md bg-opacity-70">
            <div className="absolute inset-0 w-full">
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
          className="flex  flex-col gap-4 px-2 py-2 md:justify-between"
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
            <Pill>{article.readingTime.text}</Pill>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function ScrollAnimation({ articles }: { articles: Article[] }) {
  const targetRef = useRef<HTMLDivElement>(null);
  let { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end end'],
  });
  scrollYProgress = useSpring(scrollYProgress, springConfigs.scroll);

  const opacity = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.9, 1],
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
        className="pointer-events-none fixed left-0 top-0 h-screen w-screen bg-romaingrx-emphasis"
      />
      <motion.div className="flex w-full flex-col items-center gap-32">
        <motion.span
          style={{ opacity }}
          className="sticky top-0 mb-48 py-24 font-wise text-4xl md:py-32 md:text-5xl"
        >
          Recent blog posts
        </motion.span>

        <motion.div className="flex flex-col">
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
