import { cva, type VariantProps } from 'class-variance-authority';

const controlFocus =
  'outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent text-sm font-medium',
    'transition-colors duration-200',
    controlFocus,
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-link underline-offset-4 hover:text-link-hover hover:underline',
      },
      size: {
        default: 'min-h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'min-h-9 gap-1.5 rounded-md px-3 py-1.5 has-[>svg]:px-2.5',
        lg: 'min-h-11 rounded-md px-6 py-2.5 has-[>svg]:px-4',
        icon: 'size-11 p-0',
        'icon-sm': 'size-11 p-0',
        'icon-lg': 'size-12 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;
export type IconSize = Extract<ButtonSize, 'icon' | 'icon-sm' | 'icon-lg'>;
export type AccessibleControlProps =
  | { size?: Exclude<ButtonSize, IconSize>; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { size: IconSize; 'aria-label': string; 'aria-labelledby'?: string }
  | { size: IconSize; 'aria-label'?: string; 'aria-labelledby': string };

export const badgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium',
    'transition-colors duration-200',
    controlFocus,
    '[&>svg]:pointer-events-none [&>svg]:size-3',
  ],
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'border-border text-foreground',
        active: 'border-transparent bg-accent text-accent-foreground shadow',
      },
      size: {
        default: 'min-h-6',
        sm: 'min-h-5 px-1.5 text-[0.6875rem]',
        lg: 'min-h-8 px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>['size']>;

export const fieldVariants = cva([
  'min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm',
  'outline-none transition-colors placeholder:text-muted-foreground',
  'focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus/30',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-status-error aria-invalid:ring-2 aria-invalid:ring-status-error/30',
]);

export const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'border-border bg-background text-foreground',
        destructive: 'border-destructive/50 bg-destructive/10 text-foreground',
        note: 'border-status-info/50 bg-status-info/10 text-foreground',
        tip: 'border-status-success/50 bg-status-success/10 text-foreground',
        important: 'border-primary/50 bg-primary/10 text-foreground',
        warning: 'border-status-warning/50 bg-status-warning/10 text-foreground',
        question: 'border-status-info/50 bg-status-info/10 text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;
