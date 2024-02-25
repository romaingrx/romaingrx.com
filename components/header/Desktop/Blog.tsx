'use client';
import clsx from 'clsx';
import {
  AnimatePresence,
  Variants,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
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

const variants = (isScrollingDown: boolean): Variants => ({
  initial: {
    opacity: 0,
    y: isScrollingDown ? 10 : -10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: isScrollingDown ? 10 : -10,
  },
});

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
  const scrollYVelocity = useVelocity(scrollYProgress);
  const scrollYProgressSpring = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
  });

  // const hideonScroll = useTransform(scrollY, (value) => value > 300);
  let progress = useTransform(scrollYProgressSpring, [0, 1], ['0%', '100%']);

  const [scrollDown, setScrollDown] = useState(false);
  scrollYVelocity.on('change', (value) => {
    setScrollDown(value > 0);
    console.log(value);
  });

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
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.ul
              className="text-md flex items-center bg-romaingrx-header px-3 text-zinc-800 shadow-lg shadow-zinc-800/5 backdrop-blur-md dark:text-zinc-200"
              style={{
                height: '3rem',
              }}
            >
              <motion.li
                className="my-auto"
                variants={variants(scrollDown)}
                initial="initial"
                animate="animate"
                exit="exit"
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
                <motion.li
                  className="my-auto px-3"
                  variants={variants(scrollDown)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <a href="#" className="group flex gap-3">
                    <span className="my-auto text-lg">{article.title}</span>
                    <ArrowIcon
                      angle={90}
                      size={'4'}
                      title="Go back to top"
                      className="my-auto origin-center transform transition-all duration-300 group-hover:translate-y-[-0.1rem] group-hover:scale-110 group-hover:text-romaingrx-brand"
                    />
                  </a>
                </motion.li>
              ) : (
                pages.map(({ name, href }) => (
                  <motion.li
                    className="my-auto"
                    variants={variants(scrollDown)}
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
