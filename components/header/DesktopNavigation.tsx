'use client';
import clsx from 'clsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
            isActive
              ? 'text-bob-500 dark:text-bob-400'
              : 'hover:text-bob-500 dark:hover:text-bob-400',
          )}
        >
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
  const navRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    setHeight(`${navRef.current?.offsetHeight}px`);
  }, []);

  const { scrollYProgress } = useScroll({
    target: navRef,
    offset: ['start start', 'end start'],
  });

  const marginTop = useTransform(scrollYProgress, [0, 1], ['0rem', '1.5rem']);
  const width = useTransform(scrollYProgress, [0, 1], ['100vw', '0vw']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
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
          'transition-linear transition-duration-300 fixed min-w-fit transition-all',
        )}
        style={{
          width: width,
          marginTop: marginTop,
          opacity: opacity,
        }}
      >
        <motion.ul
          className="flex bg-white/95 px-3 text-sm text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-100/20 dark:bg-zinc-700/95 dark:text-zinc-200 dark:ring-zinc-700/20"
          style={{
            borderRadius: borderRadius,
            borderWidth: borderWidth
          }}
        >
          <motion.li
            className="my-auto dark:invert"
            style={{
              width: logoWidth,
              opacity: logoOpacity,
            }}
          >
            <Link href="/">
              <Image src="/favicon.ico" alt="logo" width={32} height={32} />
            </Link>
          </motion.li>
          {pages.map(({ name, href }, idx) => (
            <NavLink key={idx} href={href}>
              {name}
            </NavLink>
          ))}
        </motion.ul>
      </motion.nav>
      <motion.div
        style={{
          height: height,
        }}
      ></motion.div>
    </>
  );
}
