'use client';

import { Analytics } from '@vercel/analytics/react';

export default function AnalyticsWrapper(): JSX.Element {
  return (
    <>
      <Analytics />
    </>
  );
}
