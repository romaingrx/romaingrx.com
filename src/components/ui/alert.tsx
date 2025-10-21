import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
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
  }
);
export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
