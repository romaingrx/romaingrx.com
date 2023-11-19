import { CardProps as _CardProps } from '@nextui-org/react';

export interface CardProps extends _CardProps {
  hoverable?: boolean;
  glass?: boolean;
  depth?: 0 | 1 | 2 | 3;
}
