'use client';
import { useBreakpoint } from '@/hooks/tailwind';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto my-6 flex max-w-4xl flex-col gap-4 px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      {children}
    </div>
  );
}

export function ArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 grid w-full grid-cols-[1fr] flex-col gap-4 px-2 pt-16 md:px-4 md:pt-32 lg:grid-cols-[0fr_1fr_15rem] xl:grid-cols-[15rem_1fr_15rem] xl:gap-8">
      {children}
    </div>
  );
}
