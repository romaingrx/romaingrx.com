import { styled } from '@/design';

const StyledCallout = styled('aside', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-1)',
  margin: '15px 20px',
  padding: '5px 15px',
  color: 'var(--romaingrx-colors-typeface-primary)',
  background: 'var(--background)',
  // border: '1px solid var(--romaingrx-colors-emphasis)',
  borderRadius: 'var(--space-1)',

  '&::before': {
    content: '""',
    position: 'absolute',
    left: '0',
    top: '0',
    bottom: '0',
    width: '5px',
    // borderRadius: '5px 0 0 5px',
    background: 'var(--sidebar-background, var(--romaingrx-colors-brand))',
  },

  '& p': {
    margin: '0',
  },

  '& #header': {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'var(--font-size-1)',
    fontWeight: 'var(--font-weight-bold)',
    gap: 'var(--space-2)',
    marginLeft: '5px',
    color: 'var(--icon-color)',
  },

  variants: {
    variant: {
      info: {
        '--background': 'var(--romaingrx-colors-emphasis)',
        '--icon-color': 'var(--romaingrx-colors-brand)',
        '--sidebar-background': 'var(--romaingrx-colors-brand)',
      },
      important: {
        '--background': 'var(--romaingrx-colors-emphasis)',
        '--icon-color': 'var(--romaingrx-colors-brand)',
        '--sidebar-background': 'var(--romaingrx-colors-brand)',
      },
      warning: {
        '--background': 'var(--romaingrx-colors-warning-emphasis)',
        '--icon-color': 'var(--romaingrx-colors-warning)',
        '--sidebar-background': 'var(--romaingrx-colors-warning)',
      },
      danger: {
        '--background': 'var(--romaingrx-colors-danger-emphasis)',
        '--icon-color': 'var(--romaingrx-colors-danger)',
        '--sidebar-background': 'var(--romaingrx-colors-danger)',
      },
      success: {
        '--background': 'var(--romaingrx-colors-success-emphasis)',
        '--icon-color': 'var(--romaingrx-colors-success)',
        '--sidebar-background': 'var(--romaingrx-colors-success)',
      },
    },
  },
});

export { StyledCallout };
