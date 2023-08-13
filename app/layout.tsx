import { Roboto } from 'next/font/google';
import clsx from 'clsx';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import ClientThemeProvider from '@/components/providers/theme-provider';
import AnalyticsWrapper from '@/components/Analytics';
import Background from '@/components/Background';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFontAwesome, fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas, faFontAwesome);

library.add();

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] });

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
    <html className="h-full antialiased" lang="en">
      <head />
      <body
        className={clsx(
          roboto.className,
          'flex h-full min-h-screen flex-col bg-zinc-50 dark:bg-black',
        )}
      >
        <ClientThemeProvider>
          <Background />
          <div className="relative min-h-screen selection:bg-bob-500/50 ">
            <div className="flex h-full flex-col justify-between">
              <div>
                <Header />
                <main>{children}</main>
              </div>
              <Footer />
            </div>
            <AnalyticsWrapper />
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
