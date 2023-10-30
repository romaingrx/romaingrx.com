'use client';
import { useState } from 'react';
import { MenuButton } from '../icon/motion';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { type PageProps } from './Header';
import { Modal } from '@mui/material';
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
          className="absolute right-0 top-0 m-5"
          style={{ zIndex: 11 }}
        >
          <MenuButton
            id='mobile-menu-button'
            isOpen={isOpen}
            className={clsx('pointer-events-auto', isOpen ? 'stroke-white' : 'dark:stroke-white stroke-black')}
            strokeWidth={2.5}
            width={32}
            height={32}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <Modal open={isOpen} onClose={() => setIsOpen(false)} sx={{
              zIndex: 10,
            }}>
              <motion.div
                initial={{ opacity: 0, y: '-100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '-100%' }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto z-10 h-screen w-screen bg-bob-500 dark:bg-zinc-800"
              >
                <motion.nav className="w-full flex-col">
                  <ul className="items-left flex h-full flex-col justify-center gap-8 pl-8 pr-16 pt-16">
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
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}