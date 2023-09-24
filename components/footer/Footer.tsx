'use client';
import Link from 'next/link';
import { pages } from '../header/Header';
import { usePathname } from 'next/navigation';
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
  return (
    <>
      <footer className="mt-32 max-h-full">
        <div className="justify-between border-t border-zinc-100 px-4 py-8 dark:border-zinc-700/50">
          <div className="flex flex-col justify-between">
            <div className="flex flex-row justify-between">
              <div />
              <div className="flex flex-row justify-start gap-2">
                <Link href="https://github.com/romaingrx">Github</Link>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row justify-start gap-2 font-wise">
                {pages.map(({ name, href }, id) => (
                  <>
                    <NavLink href={href} key={id}>
                      {name}
                    </NavLink>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
