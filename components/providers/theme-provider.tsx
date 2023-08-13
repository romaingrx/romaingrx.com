'use client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';

export default function ClientThemeProvider({
  children: children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <ThemeProvider attribute="class" enableSystem={true}>
        <NextUIProvider>{children}</NextUIProvider>
      </ThemeProvider>
    </>
  );
}
