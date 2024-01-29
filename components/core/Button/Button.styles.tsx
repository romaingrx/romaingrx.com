import { styled } from '@/design';

const StyledButton = styled('button', {
  display: 'flex',
  gap: 'var(--space-2)',
  alignItems: 'center',
  outline: 'none',
  cursor: 'pointer',
  border: '0',
  font: 'inherit',

  height: '44px',
  width: 'max-content',
  transition: 'background 0.2s, transform 0.2s, color 0.2s, box-shadow 0.3s',
  borderRadius: 'var(--border-radius-1)',

  background: 'var(--background, white)',
  color: 'var(--color, black)',
  transform: 'scale(var(--button-scale, 1)) translateZ(0)',
  boxShadow: 'var(--shadow, none)',
  opacity: 'var(--opacity, 1)',
  '--shadow-hover-primary': '0 2px 40px -4px var(--romaingrx-form-input-focus)',

  '&::after': {
    zIndex: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    content: '""',
    display: 'block',
    width: '100%',
    height: '100%',
    transition:
      'box-shadow 0.3s ease, border-color 0.2s, background 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    borderRadius: 'var(--corner, var(--border-radius-1))',
    border:
      'var(--border-thickness, 1px) solid var(--border-color, transparent)',
    boxShadow: 'var(--shadow, none)',
  },

  '&:active': {
    '--button-scale': '0.95',
  },
  '&:disabled': {
    cursor: 'not-allowed',
  },

  '#startIcon, #endIcon': {
    transition: 'transform .4s',
  },
  '&:not(:disabled)': {
    '&:hover #startIcon, &:focus #startIcon': {
      transform:
        'translateX(calc(var(--translateX, 0px) * -1)) translateY(calc(var(--translateY, 0px) * -1));',
    },
    '&:hover #endIcon, &:focus #endIcon': {
      transform:
        'translateX(var(--translateX, 0px)) translateY(calc(var(--translateY, 0px) * -1));',
    },
  },

  variants: {
    size: {
      sm: {
        fontSize: 'var(--font-size-1)',
        fontWeight: 'var(--font-weight-2)',
        padding: '6px 12px',
      },
      md: {
        fontSize: 'var(--font-size-2)',
        fontWeight: 'var(--font-weight-2)',
        padding: '12px 18px',
      },
      lg: {
        fontSize: 'var(--font-size-3)',
        fontWeight: 'var(--font-weight-3)',
        padding: '16px 24px',
      },
    },
    variant: {
      primary: {
        '--icon-hover-color': 'var(--romaingrx-colors-brand)',
        '--icon-hover-background': 'var(--romaingrx-colors-emphasis)',
        '--background': 'var(--romaingrx-colors-brand)',
        '--color': 'var(--romaingrx-colors-typeface-primary)',

        '&:disabled': {
          '--background': 'var(--romaingrx-form-input-disabled)',
          '--color': 'var(--romaingrx-colors-typeface-tertiary)',
        },

        '&:hover': {
          '&:not(:disabled)': {
            '--shadow': 'var(--shadow-hover-primary)',
          },
        },

        '&:focus-visible': {
          '--shadow': 'var(--shadow-hover-primary)',
        },
      },
      secondary: {
        '--icon-hover-color': 'var(--romaingrx-colors-typeface-secondary)',
        '--icon-hover-background': 'var(--romaingrx-colors-brand)',
        '--background': 'var(--romaingrx-colors-emphasis)',
        '--color': 'var(--romaingrx-colors-brand)',
        '&:disabled': {
          '--background': 'var(--romaingrx-form-input-disabled)',
          '--color': 'var(--romaingrx-colors-typeface-tertiary)',
        },

        '&:hover': {
          '&:not(:disabled)': {
            '--shadow': 'var(--shadow-hover-primary)',
          },
        },

        '&:focus-visible': {
          '--shadow': 'var(--shadow-hover-primary)',
        },
      },
    },
    contentType: {
      normal: {},
      icon: {
        '#children': {
          transition: 'transform .4s',
        },

        '&:not(:disabled)': {
          '&:hover #children, &:focus #children': {
            transform:
              'translateX(var(--translateX, 0px)) translateY(var(--translateY, 0px));',
          },
        },

        '&:hover': {
          '&:not(:disabled)': {
            '--border-color': 'var(--icon-hover-color)',
            '--border-thickness': '2px',
            '--color': 'var(--icon-hover-color)',
            '--background': 'var(--icon-hover-background)',
            '--shadow': 'var(--shadow-hover-primary)',
            '--button-scale': '0.95',
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
    contentType: 'normal',
  },
});

export { StyledButton };
