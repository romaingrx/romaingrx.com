import { CSS } from '@/design';
import { type LinkProps as NextLinkProps } from 'next/link';
import { type LinkVariant } from './Link.styles';

interface LinkProps extends NextLinkProps {
  variant?: LinkVariant;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
  css?: CSS;
}

export { type LinkProps };
