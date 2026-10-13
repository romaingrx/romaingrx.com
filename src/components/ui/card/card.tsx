import type * as React from 'react';

import { cn } from '@/lib/utils';

import { cardClasses } from './variants';

/** React twins of the card parts, for interactive islands only. */
function part(slot: keyof typeof cardClasses) {
  return function CardPart({ className, ...props }: React.ComponentProps<'div'>) {
    return (
      <div
        data-slot={slot === 'root' ? 'card' : `card-${slot}`}
        className={cn(cardClasses[slot], className)}
        {...props}
      />
    );
  };
}

export const Card = part('root');
export const CardHeader = part('header');
export const CardTitle = part('title');
export const CardDescription = part('description');
export const CardAction = part('action');
export const CardContent = part('content');
export const CardFooter = part('footer');
