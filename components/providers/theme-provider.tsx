'use client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';


export default function ClientThemeProvider({
  children: children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <NextThemeProvider
        attribute="class"
        enableSystem={true}
      >
        <NextUIProvider>{children}</NextUIProvider>
      </NextThemeProvider>
    </>
  );
}
