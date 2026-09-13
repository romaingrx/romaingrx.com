import * as React from 'react';

import { cn } from '@/lib/utils';

import { buttonVariants, type AccessibleControlProps, type ButtonVariant } from '../variants';
type LinkProps = Omit<React.ComponentProps<'a'>, 'href' | 'aria-label' | 'aria-labelledby'> & {
  href: string;
} & { variant?: ButtonVariant } & AccessibleControlProps;

function Link({ className, variant = 'link', size = 'default', ...props }: LinkProps) {
  return (
    <a data-slot="link" {...props} className={cn(buttonVariants({ variant, size }), className)} />
  );
}

export { Link };
