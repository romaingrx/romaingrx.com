import React from 'react';
import { CSS } from '@/design';

export type CalloutVariant =
  | 'info'
  | 'warning'
  | 'danger'
  | 'success'
  | 'important';

export interface CalloutProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  label?: React.ReactNode | string;
  variant?: CalloutVariant;
  css?: CSS;
}
