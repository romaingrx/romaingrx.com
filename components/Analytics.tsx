'use client';
import React from 'react';

import { Analytics } from '@vercel/analytics/react';

export default function AnalyticsWrapper(): JSX.Element {
  return (
    <>
      <Analytics />
    </>
  );
}
