import { styled } from '@/design';

export const StyledPill = styled('span', {
  display: 'inline-flex !important',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5px 8px !important',
  width: 'fit-content',
  minWidth: '40px',
  height: '28px',
  fontSize: 'var(--font-size-1)',
  fontWeight: 'var(--font-weight-4)',
  cursor: 'default',
  userSelect: 'none',
  borderRadius: 'var(--border-radius-1)',

  background: 'var(--pill-background)',
  color: 'var(--pill-color)',

  variants: {
    dark: {
      true: {},
    },
    variant: {
      default: {
        '--pill-background': 'var(--romaingrx-colors-foreground)',
        '--pill-color': 'var(--romaingrx-colors-brand)',
      },
      info: {
        '--pill-background': 'var(--romaingrx-colors-emphasis)',
        '--pill-color': 'var(--romaingrx-colors-brand)',
      },
      success: {
        '--pill-background': 'var(--romaingrx-colors-success-emphasis)',
        '--pill-color': 'hsl(var(--palette-green-80))',
      },
      warning: {
        '--pill-background': 'var(--romaingrx-colors-warning-emphasis)',
        '--pill-color': 'var(--romaingrx-colors-warning)',
      },
      danger: {
        '--pill-background': 'var(--romaingrx-colors-danger-emphasis)',
        '--pill-color': 'var(--romaingrx-colors-danger)',
      },
    },
  },

  compoundVariants: [
    {
      variant: 'success',
      dark: true,
      css: {
        '--pill-color': 'hsla(var(--palette-green-45)) !important',
      },
    },
    {
      variant: 'warning',
      dark: true,
      css: {
        '--pill-color': 'hsla(var(--palette-orange-45)) !important',
      },
    },
    {
      variant: 'danger',
      dark: true,
      css: {
        '--pill-color': 'hsla(var(--palette-red-45)) !important',
      },
    },
  ],

  defaultVariants: {
    variant: 'default',
  },
});
