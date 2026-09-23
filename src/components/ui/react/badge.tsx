import * as React from 'react';

import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { badgeVariants } from '../variants';

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      data-size={size ?? 'default'}
      {...props}
      className={cn(badgeVariants({ variant, size }), className)}
    />
  );
}

export { Badge, badgeVariants };
