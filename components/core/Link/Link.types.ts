import { CSS } from '@/design';
import Link, { type LinkProps as NextLinkProps } from 'next/link';

interface LinkProps extends NextLinkProps {
  children: React.ReactNode;
  css?: CSS;
}

export { type LinkProps };
