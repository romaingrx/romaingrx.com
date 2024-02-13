'use client';
import clsx from 'clsx';
import {
  AnimatePresence,
  Variants,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import HideOnScroll from '@/components/core/HideOnScroll';
import { useBreakpoint } from '@/hooks/tailwind';
import { Article } from '@/.contentlayer/generated';
import { PageProps } from '../Header';
import { NavLink } from './Navigation';
import { ArrowIcon } from '@/components/core/Icon/Icon';
import { Button } from '@/components/core';

const variants: Variants = {
  initial: {
    opacity: 0,
    y: -10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

export default function BlogHeader({
  pages,
  article,
}: {
  pages: PageProps[];
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

  const [showTitle, setShowTitle] = useState(false);
  scrollY.on('change', (value) => {
    if (value > 300) {
      setShowTitle(true);
    } else {
      setShowTitle(false);
    }
  });

  return (
    <>
      <motion.nav
        ref={navRef}
        className={clsx(
          'transition-linear transition-duration-300 fixed left-[50%] z-50 w-full min-w-fit -translate-x-1/2 transform transition-all',
        )}
      >
        <HideOnScroll active={isBelowMd}>
          <AnimatePresence mode="popLayout">
            <motion.ul
              className="text-md flex items-center gap-3 bg-romaingrx-header px-3 text-zinc-800 shadow-lg shadow-zinc-800/5 backdrop-blur-md dark:text-zinc-200"
              style={{
                height: '3rem',
              }}
            >
              <motion.li
                className="my-auto"
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                }}
              >
                <Link href="/">
                  <Image
                    src="/icon/sm?w=32&h=32&auto=format"
                    alt="logo"
                    width={32}
                    height={32}
                  />
                </Link>
              </motion.li>
              {showTitle ? (
                <>
                  <motion.li
                    className="my-auto flex"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <span className="my-auto text-lg">{article.title}</span>
                  </motion.li>
                  <motion.li
                    className="my-auto"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={{
                      scale: 1.1,
                      y: -2,
                    }}
                  >
                    <a
                      className="my-auto transition-colors duration-300 hover:text-romaingrx-brand"
                      href="#"
                    >
                      <ArrowIcon angle={90} size={'4'} title="Go back to top" />
                    </a>
                  </motion.li>
                </>
              ) : (
                pages.map(({ name, href }) => (
                  <motion.li
                    className="my-auto"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    key={name}
                  >
                    <NavLink href={href}>{name}</NavLink>
                  </motion.li>
                ))
              )}
            </motion.ul>
            <motion.div
              className="h-[0.1rem] bg-romaingrx-brand md:hidden"
              style={{ width: progress }}
            />
          </AnimatePresence>
        </HideOnScroll>
      </motion.nav>
    </>
  );
}
