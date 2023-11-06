'use client';

import { useTheme } from 'next-themes';

function StringTheme() {
  const { resolvedTheme } = useTheme();
  return <span>{resolvedTheme}</span>;
}

export { StringTheme };
