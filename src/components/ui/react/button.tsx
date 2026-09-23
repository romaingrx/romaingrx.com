import * as React from 'react';

import { cn } from '@/lib/utils';

import { buttonVariants, type AccessibleControlProps, type ButtonVariant } from '../variants';
type ButtonProps = Omit<React.ComponentProps<'button'>, 'aria-label' | 'aria-labelledby'> & {
  variant?: ButtonVariant;
} & AccessibleControlProps;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
    />
  );
}

export { Button, buttonVariants };
