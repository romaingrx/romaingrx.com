'use client';
import clsx from 'clsx';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import HideOnScroll from '@/components/core/HideOnScroll';
import { useBreakpoint } from '@/hooks/tailwind';
import { Article } from '@/.contentlayer/generated';

export default function BlogHeader({
  article,
}: {
  article: Article;
}): JSX.Element {
  const { isBelowMd } = useBreakpoint('md');
  const navRef = useRef<HTMLDivElement>(null);

  // TODO : review the timing to make it more snappy (probably with a function instead of an smooth animation)
  const { scrollY, scrollYProgress } = useScroll();
  const scrollYProgressSpring = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
  });

  // const hideonScroll = useTransform(scrollY, (value) => value > 300);
  let progress = useTransform(scrollYProgressSpring, [0, 1], ['0%', '100%']);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={clsx(
          'transition-linear transition-duration-300 fixed left-[50%] z-50 w-full min-w-fit -translate-x-1/2 transform transition-all',
        )}
      >
        <HideOnScroll active={isBelowMd}>
          <motion.ul
            className="text-md flex items-center gap-2 bg-romaingrx-header px-3 text-zinc-800 shadow-lg shadow-zinc-800/5 backdrop-blur-md dark:text-zinc-200"
            style={{
              height: '3rem',
            }}
          >
            <motion.li className="my-auto">
              <Link href="/">
                <Image
                  src="/icon/sm?w=32&h=32&auto=format"
                  alt="logo"
                  width={32}
                  height={32}
                />
              </Link>
            </motion.li>
            <motion.li className="">
              <span className="my-auto text-lg">{article.title}</span>
            </motion.li>
          </motion.ul>
          <motion.div
            className="h-[0.1rem] bg-romaingrx-brand md:hidden"
            style={{ width: progress }}
          />
        </HideOnScroll>
      </motion.nav>
    </>
  );
}
