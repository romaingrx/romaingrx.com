'use client';
import Link from 'next/link';
import { pages } from '../header/Header';
import { usePathname } from 'next/navigation';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import clsx from 'clsx';
import XIcon from '@/components/icon/x';
import { VR } from '@/components/core/base';
import { useBreakpoint } from '@/hooks/tailwind';

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const isActive = usePathname() === href;
  return (
    <>
      <Link
        href={href}
        className={clsx(
          className,
          isActive
            ? 'text-bob-500 dark:text-bob-400'
            : 'hover:text-bob-500 dark:hover:text-bob-400',
        )}
      >
        {children}
      </Link>
    </>
  );
}


export default function Footer(): JSX.Element {
  const { isBelowMd } = useBreakpoint('md')
  return (
    <>
      <footer className="mt-32 max-h-full">
        <div className="justify-between border-t border-zinc-100 px-4 py-4 dark:border-zinc-700/50">
          <div className="flex flex-col justify-between gap-2 md:flex-row">
            <div className="flex flex-row justify-between md:flex-grow">
              <div className="flex flex-row justify-start gap-2 font-wise">
                {pages.map(({ name, href }, id) => (
                  <>
                    <NavLink href={href} key={id}>
                      {name}
                    </NavLink>
                  </>
                ))}
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-2">
                <div className='flex flex-row justify-end gap-2'>
                  <Link href="https://github.com/romaingrx">
                    <FaGithub className='h-full' />
                  </Link>
                  <Link href="https://x.com/_romaingrx">
                    <XIcon className='h-full' />
                  </Link>
                  <Link href="https://www.linkedin.com/in/romaingraux">
                    <FaLinkedin className='h-full' />
                  </Link>
                </div>
                {!isBelowMd && <VR />}
              </div>
            </div>
            <span className="text-zinc-600 dark:text-zinc-300 text-xs text-center flex flex-col justify-center">
              Made with ❤️‍🔥 ️by romaingrx © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
