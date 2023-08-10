'use client';
import { ThemeProvider } from 'next-themes';

export default function ClientThemeProvider({
  children: children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <ThemeProvider attribute="class" enableSystem={true}>
        {children}
      </ThemeProvider>
    </>
  );
}
