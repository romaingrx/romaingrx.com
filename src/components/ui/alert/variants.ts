import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        note: 'border-blue-500/50 bg-blue-50/50 text-blue-900 dark:border-blue-400/50 dark:bg-blue-950/50 dark:text-blue-100 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',
        tip: 'border-green-500/50 bg-green-50/50 text-green-900 dark:border-green-400/50 dark:bg-green-950/50 dark:text-green-100 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
        important:
          'border-purple-500/50 bg-purple-50/50 text-purple-900 dark:border-purple-400/50 dark:bg-purple-950/50 dark:text-purple-100 [&>svg]:text-purple-600 dark:[&>svg]:text-purple-400',
        warning:
          'border-yellow-500/50 bg-yellow-50/50 text-yellow-900 dark:border-yellow-400/50 dark:bg-yellow-950/50 dark:text-yellow-100 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
        question:
          'border-blue-500/50 bg-blue-50/50 text-blue-900 dark:border-blue-400/50 dark:bg-blue-950/50 dark:text-blue-100 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;
export type AlertVariant = NonNullable<AlertVariants['variant']>;
