'use client';
import clsx from 'clsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import HideOnScroll from '../core/HideOnScroll';
import { useBreakpoint } from '@/hooks/tailwind';

type Props = {
  pages: {
    name: string;
    href: string;
  }[];
  className: string;
};

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): JSX.Element {
  const isActive = usePathname() === href;
  return (
    <>
      <li>
        <Link
          href={href}
          className={clsx(
            'relative block px-3 py-2 transition',
            'hover:text-bob-500 dark:hover:text-bob-400',
            isActive && 'text-bob-500 dark:text-bob-400',
          )}
        >
          {isActive && (
            <motion.div
              layoutId={'nav'}
              className="absolute inset-0 bg-bob-500/20 dark:bg-bob-400/20 rounded-md m-1"
              transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 1.0, ease: [0.83, -0.01, 0.16, 0.99] }}
            />
          )}
          {children}
        </Link>
      </li>
    </>
  );
}

export default function DesktopNavigation({
  pages,
  className,
}: Props): JSX.Element {
  const { isBelowMd } = useBreakpoint('md');
  const navRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: navRef,
    offset: ['start start', 'end start'],
  });

  const marginTop = useTransform(scrollYProgress, [0, 1], ['0rem', '1.5rem']);
  const width = useTransform(scrollYProgress, [0, 1], ['100vw', '0vw']);
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 1],
    ['0rem', '0.75rem'],
  );
  const borderWidth = useTransform(
    scrollYProgress,
    [0, 1],
    ['0rem', '0.05rem'],
  );
  const logoWidth = useTransform(scrollYProgress, [0, 0.8], ['32px', '0px']);
  const logoOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={clsx(
          className,
          'transition-linear transition-duration-300 fixed left-[50%] z-50 min-w-fit -translate-x-1/2 transform transition-all',
        )}
        style={{
          width: width,
          marginTop: marginTop,
        }}
      >
        <HideOnScroll active={isBelowMd}>
          <motion.ul
            className="text-md flex px-3 text-zinc-800 shadow-lg shadow-zinc-800/5 backdrop-blur-sm dark:text-zinc-200"
            style={{
              borderRadius: borderRadius,
              borderWidth: borderWidth,
            }}
          >
            <motion.li
              className="my-auto"
              style={{
                width: logoWidth,
                opacity: logoOpacity,
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
            {pages.map(({ name, href }) => (
              <NavLink key={href} href={href}>
                {name}
              </NavLink>
            ))}
          </motion.ul>
        </HideOnScroll>
      </motion.nav>
    </>
  );
}
