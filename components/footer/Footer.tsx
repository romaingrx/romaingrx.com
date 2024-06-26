import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import XIcon from '@/components/core/Icon/x';
import { VR } from '@/components/core/base';
import clsx from 'clsx';

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <>
      <Link
        href={href}
        className={clsx('hover:text-romaingrx-brand', className)}
      >
        {children}
      </Link>
    </>
  );
}

export default function Footer(): JSX.Element {
  return (
    <>
      <footer className="mt-32 max-h-full">
        <div className="justify-between border-t border-zinc-100 px-4 py-4 dark:border-zinc-700/50">
          <div className="flex flex-col justify-between gap-2 md:flex-row">
            <div className="flex flex-row justify-between md:flex-grow">
              <div className="flex flex-row justify-start gap-2 font-wise">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/design">Design</NavLink>
              </div>
              <div className="flex flex-col justify-center gap-2 md:flex-row">
                <div className="flex flex-row justify-end gap-2">
                  <Link href="https://github.com/romaingrx">
                    <FaGithub className="h-full" />
                  </Link>
                  <Link href="https://x.com/_romaingrx">
                    <XIcon className="h-full" />
                  </Link>
                  <Link href="https://www.linkedin.com/in/romaingraux">
                    <FaLinkedin className="h-full" />
                  </Link>
                </div>
                <div className="hidden md:flex">
                  <VR />
                </div>
              </div>
            </div>
            <span className="flex flex-col justify-center text-center text-xs text-zinc-600 dark:text-zinc-300">
              Made with ❤️‍🔥 ️by romaingrx © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
