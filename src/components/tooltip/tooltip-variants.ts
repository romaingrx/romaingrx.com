import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipVariants = cva(
  [
    'pointer-events-none',
    'invisible',
    'absolute',
    'left-1/2',
    'z-50',
    'whitespace-nowrap',
    'rounded-md',
    'px-2',
    'py-1',
    'text-xs',
    'font-medium',
    'shadow-lg',
    'opacity-0',
    'transition-opacity',
    'duration-200',
    'group-hover:visible',
    'group-hover:opacity-100',
  ],
  {
    variants: {
      side: {
        top: '-top-1 -translate-x-1/2 -translate-y-full',
        right: '-left-full top-1/2 -translate-y-1/2 translate-x-full',
        bottom: '-bottom-1 -translate-x-1/2 translate-y-full',
        left: '-right-full top-1/2 -translate-y-1/2 -translate-x-full',
      },
      intent: {
        default: 'bg-card text-card-foreground',
        destructive: 'bg-desctructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      side: 'top',
      intent: 'default',
    },
  }
);

export type TooltipVariants = VariantProps<typeof tooltipVariants>;
