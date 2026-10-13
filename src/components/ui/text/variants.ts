import { cva, type VariantProps } from 'class-variance-authority';

/** Body copy. Hierarchy comes from size and tone, not from new colours. */
export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    tone: {
      default: '',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
    },
    weight: {
      normal: '',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    leading: {
      default: '',
      snug: 'leading-snug',
      relaxed: 'leading-relaxed',
    },
    clamp: {
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
    },
  },
  defaultVariants: {
    tone: 'default',
    weight: 'normal',
    leading: 'default',
  },
});

/** Titles. `size` picks the rung of the scale; the tag is chosen separately. */
export const headingVariants = cva('tracking-tight', {
  variants: {
    size: {
      display: 'text-4xl font-bold sm:text-5xl',
      page: 'text-3xl font-bold sm:text-4xl',
      section: 'text-2xl font-semibold',
      subsection: 'text-xl font-semibold',
      card: 'text-base leading-snug font-semibold',
      label: 'text-sm font-semibold tracking-normal',
    },
  },
  defaultVariants: {
    size: 'section',
  },
});

export type TextVariants = VariantProps<typeof textVariants>;
export type HeadingVariants = VariantProps<typeof headingVariants>;
