import type * as React from 'react';

import { cn } from '@/lib/utils';

import { buttonVariants, type ButtonVariants } from './variants';

/** React twin of `button.astro`, for interactive islands only. */
export function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: React.ComponentProps<'button'> & ButtonVariants) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
