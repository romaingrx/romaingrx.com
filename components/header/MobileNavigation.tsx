'use client';
import { useState } from 'react';
import { MenuButton } from '../icons/motion';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { type PageProps } from './Header';
import clsx from 'clsx';

type Props = {
  pages: PageProps[];
  className: string;
};

export default function MobileNavigation({
  pages,
  className,
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={className}>
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="absolute right-0 top-0 z-20 m-5"
        >
          <MenuButton
            isOpen={isOpen}
            className={'pointer-events-auto'}
            strokeWidth={2.5}
            width={32}
            height={32}
            color={isOpen ? '#fff' : '#000'}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto absolute left-0 top-0 z-10 h-screen w-screen bg-bob-500 dark:bg-gray-800"
            >
              <motion.nav className="w-full flex-col">
                <ul className="items-left flex h-full flex-col justify-center gap-8 p-8">
                  {pages.map((page, idx) => (
                    <motion.span
                      key={page.name}
                      initial={{ opacity: 0, x: '-100%' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '-100%' }}
                      transition={{ duration: 0.15, delay: (idx + 1) * 0.05 }}
                      className="text-4xl font-bold text-white dark:text-gray-100"
                    >
                      <Link href={page.href} onClick={() => setIsOpen(false)}>
                        <span className="flex items-center gap-5 rounded-lg p-2 hover:bg-white hover:text-bob-400 ">
                          <span className="my-auto inline-block h-6 w-6">
                            {page.icon}
                          </span>
                          <span className="my-auto">{page.name}</span>
                        </span>
                      </Link>
                    </motion.span>
                  ))}
                </ul>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
