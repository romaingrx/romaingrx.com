import { cva, type VariantProps } from 'class-variance-authority';

/** Responsive columns: one column on mobile, `cols` from `md` up. */
export const gridVariants = cva('grid grid-cols-1', {
  variants: {
    cols: {
      1: '',
      2: 'md:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'md:grid-cols-4',
    },
    gap: {
      2: 'gap-2',
      4: 'gap-4',
      6: 'gap-6',
      /** Card lists: wide gutters, generous rows. */
      cards: 'gap-x-8 gap-y-10',
      16: 'gap-16',
    },
  },
  defaultVariants: {
    cols: 2,
    gap: 6,
  },
});

export type GridVariants = VariantProps<typeof gridVariants>;
