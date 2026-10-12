import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipVariants = cva(
  [
    'pointer-events-none',
    'invisible',
    'absolute',
    'left-1/2',
    'z-50',
    'whitespace-normal',
    'max-w-[min(20rem,90vw)]',
    'text-center',
    'rounded-md',
    'px-2',
    'py-1',
    'text-xs',
    'font-medium',
    'shadow-lg',
    'opacity-0',
    'transition-opacity',
    'duration-200',
    'group-hover/tooltip:visible',
    'group-hover/tooltip:opacity-100',
    'group-focus-within/tooltip:visible',
    'group-focus-within/tooltip:opacity-100',
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
        destructive: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      side: 'top',
      intent: 'default',
    },
  },
);

export type TooltipVariants = VariantProps<typeof tooltipVariants>;
