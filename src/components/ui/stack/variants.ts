import { cva, type VariantProps } from 'class-variance-authority';

/** One-axis flex arrangement with a gap from the spacing scale. */
export const stackVariants = cva('flex', {
  variants: {
    direction: {
      col: 'flex-col',
      row: 'flex-row',
      /** Column on mobile, row from `sm` up. */
      responsive: 'flex-col sm:flex-row',
    },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      1.5: 'gap-1.5',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
      12: 'gap-12',
      16: 'gap-16',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    wrap: {
      true: 'flex-wrap',
      false: '',
    },
  },
  defaultVariants: {
    direction: 'col',
    gap: 4,
  },
});

export type StackVariants = VariantProps<typeof stackVariants>;
