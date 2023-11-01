import React from 'react';
import { CSS } from '@/design';

export type BlockQuoteVariant = 'classy';

export interface BlockQuoteProps {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  variant?: BlockQuoteVariant;
  screenWidth?: boolean;
  css?: CSS;
}
