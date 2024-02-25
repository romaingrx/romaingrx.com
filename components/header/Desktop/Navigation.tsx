'use client';
import clsx from 'clsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import HideOnScroll from '@/components/core/HideOnScroll';
import { useBreakpoint } from '@/hooks/tailwind';
import { PageProps } from '../Header';

type Props = {
  pages: PageProps[];
  className: string;
};

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): JSX.Element {
  const isActive = usePathname() === href;
  return (
    <>
      <Link
        href={href}
        className={clsx(
          'relative block py-2 px-3 transition',
          'hover:text-bob-500 dark:hover:text-bob-400',
          isActive && 'text-bob-500 dark:text-bob-400',
        )}
      >
        {isActive && (
          <motion.div
            layoutId={'nav'}
            className="absolute inset-0 m-1 rounded-md bg-bob-500/20 dark:bg-bob-400/20"
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              duration: 1.0,
              ease: [0.83, -0.01, 0.16, 0.99],
            }}
          />
        )}
        {children}
      </Link>
    </>
  );
}

export default function DesktopNavigation({
  pages,
  className,
}: Props): JSX.Element {
  const { isBelowMd } = useBreakpoint('md');
  const navRef = useRef<HTMLDivElement>(null);

  // TODO : review the timing to make it more snappy (probably with a function instead of an smooth animation)
  const { scrollYProgress } = useScroll({
    target: navRef,
    offset: ['start start', 'end start'],
  });

  const timing = [0.5, 0.75];
  const marginTop = useTransform(scrollYProgress, timing, ['0rem', '1.5rem']);
  const height = useTransform(scrollYProgress, timing, ['3rem', '2.5rem']);
  const width = useTransform(scrollYProgress, timing, ['100vw', '0vw']);
  const borderRadius = useTransform(scrollYProgress, timing, [
    '0rem',
    '0.75rem',
  ]);
  const borderWidth = useTransform(scrollYProgress, timing, [
    '0rem',
    '0.05rem',
  ]);
  const logoWidth = useTransform(scrollYProgress, timing, ['32px', '0px']);
  const logoOpacity = useTransform(scrollYProgress, timing, [1, 0]);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={clsx(
          className,
          'transition-linear transition-duration-300 fixed left-[50%] z-50 min-w-fit -translate-x-1/2 transform transition-all',
        )}
        style={{
          width,
          marginTop,
        }}
      >
        <HideOnScroll active={isBelowMd}>
          <motion.ul
            className="text-md flex items-center bg-romaingrx-header px-3 text-zinc-800 shadow-lg shadow-zinc-800/5 backdrop-blur-sm dark:text-zinc-200"
            style={{
              height,
              borderRadius,
              borderWidth,
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
              <li key={name}>
                <NavLink href={href}>{name}</NavLink>
              </li>
            ))}
          </motion.ul>
        </HideOnScroll>
      </motion.nav>
    </>
  );
}
