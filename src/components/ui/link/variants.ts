import { cva, type VariantProps } from 'class-variance-authority';

export const linkVariants = cva('transition-colors', {
  variants: {
    variant: {
      /** Inline text link. */
      default: 'underline underline-offset-4 hover:text-muted-foreground',
      /** Secondary chrome: icon links, "View all". */
      muted: 'text-muted-foreground hover:text-foreground',
      /** No decoration: the child carries the styling (cards, list rows). */
      plain: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type LinkVariants = VariantProps<typeof linkVariants>;
