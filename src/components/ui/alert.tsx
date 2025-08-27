import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
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
        caution:
          'border-red-500/50 bg-red-50/50 text-red-900 dark:border-red-400/50 dark:bg-red-950/50 dark:text-red-100 [&>svg]:text-red-600 dark:[&>svg]:text-red-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
