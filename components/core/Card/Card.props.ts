import { CSS } from '@/design';
import { CardProps as _CardProps } from '@nextui-org/react';

export interface CardProps extends _CardProps {
  glass?: boolean;
  depth?: 0 | 1 | 2 | 3;
  css?: CSS;
}
