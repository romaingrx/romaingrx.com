import clsx from 'clsx';
import '@/styles/globals.css';
import type { Metadata, ResolvingMetadata } from 'next';
import ClientThemeProvider from '@/components/providers/theme-provider';
import AnalyticsWrapper from '@/components/Analytics';
import Header from '@/components/header/Header';
import Footer from '@/components/footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFontAwesome, fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas, faFontAwesome);
import { fonts } from '@/design';
import { ServerStylesheet } from './ServerStyleSheet';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = 'romaingrx.com';
  const description = "romaingrx's personal website";
  const url = 'https://romaingrx.com';

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    openGraph: {
      title: {
        template: `%s | ${title}`,
        default: title,
      },
      images: ['/api/og'],
      url,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={clsx('text-poly', ...fonts.map((font) => font.variable))}
      lang="en"
    >
      <head>
        <ServerStylesheet />
      </head>
      <body
        className={clsx('flex h-full min-h-screen flex-col bg-romaingrx-body overflow-x-clip')}
      >
        <ClientThemeProvider>
          <div className="relative">
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="h-full flex-grow flex-col">{children}</main>
              <Footer />
            </div>
            <AnalyticsWrapper />
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
