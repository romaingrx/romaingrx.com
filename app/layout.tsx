import clsx from 'clsx';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import ClientThemeProvider from '@/components/providers/theme-provider';
import AnalyticsWrapper from '@/components/Analytics';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFontAwesome, fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas, faFontAwesome);
import { fonts, getCssText, globalCss, globalStyles } from '@/design';
import { ServerStylesheet } from './ServerStyleSheet';

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
    <html className={clsx("", ...fonts.map(font => font.variable))} lang="en">
      <head>
        <ServerStylesheet />
      </head>
      <body
        className={clsx(
          'flex h-full min-h-screen flex-col bg-romaingrx-body',
        )}
      >
        <ClientThemeProvider>
          <div className="relative">
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className='flex-col flex-grow h-full'>{children}</main>
              <Footer />
            </div>
            <AnalyticsWrapper />
          </div>
        </ClientThemeProvider>
      </body>
    </html >
  );
}
