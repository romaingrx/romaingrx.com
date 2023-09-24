import clsx from 'clsx';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import ClientThemeProvider from '@/components/providers/theme-provider';
import AnalyticsWrapper from '@/components/Analytics';
import Background from '@/components/backgrounds/Background';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFontAwesome, fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas, faFontAwesome);

library.add();

import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

const worldWise = localFont({
  src: '../assets/fonts/WorldwiseSans.woff2',
  variable: '--font-worldwise',
  weight: '400',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'romaingrx.com',
  description: "romaingrx's personal website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={clsx("h-full antialiased", inter.variable, worldWise.variable)} lang="en">
      <head />
      <body
        className={clsx(
          'flex h-full min-h-screen flex-col bg-zinc-50 dark:bg-black',
        )}
      >
        <ClientThemeProvider>
          <Background />
          <div className="relative selection:bg-bob-500/50 ">
            <div className="flex flex-col justify-between min-h-screen">
              <Header />
              <main className='mt-12 md:mt-8 h-full'>{children}</main>
              <Footer />
            </div>
            <AnalyticsWrapper />
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
