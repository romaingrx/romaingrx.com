import { styled } from '@/design';

const StyledBlockQuoteScreenWidth = styled('div', {
  position: 'relative',
  top: '0',
  left: '50%',
  transform: 'translate(-50%, 0)',
  height: '100%',
  width: '100vw',
});

const StyledBlockQuoteWrapper = styled('div', {
  position: 'absolute',
  display: 'flex',
  top: '0',
  left: '0',
  transform: 'translate(25%, 25%)',
  height: '50%',
  aspectRatio: '1 / 1',
  zIndex: '0',
  color: 'var(--blockquote-color, var(--romaingrx-colors-typeface-primary))',

  '> svg': {
    width: '100%',
    height: '100%',
  },

  variants: {
    variant: {
      classy: {
        '--blockquote-color': '--romaingrx-colors-foreground',
        opacity: 0.05,
      },
    },
  },
});

const StyledBlockQuote = styled('aside', {
  position: 'relative',
  color: 'var(--romaingrx-colors-typeface-primary)',
  borderRadius: 'var(--space-1)',
  backgroundColor:
    'var(--blockquote-background, var(--romaingrx-colors-foreground))',

  variants: {
    variant: {
      classy: {
        '--blockquote-background': 'var(--romaingrx-colors-foreground)',
      },
    },
  },
});

const StyledBlockQuoteText = styled('div', {
  position: 'relative',
  zIndex: '1',
  width: '100%',
  height: '100%',
  margin: '15px 20px',
  padding: '30px 30px',
  color: 'inherit',
  fontSize: 'var(--blockquote-font-size, var(--font-size-6))',
  fontWeight: 'var(--blockquote-font-weight, var(--font-weight-3))',
});

export {
  StyledBlockQuoteScreenWidth,
  StyledBlockQuote,
  StyledBlockQuoteWrapper,
  StyledBlockQuoteText,
};
