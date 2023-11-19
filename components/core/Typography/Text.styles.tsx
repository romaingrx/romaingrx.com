import { styled } from '@/design';
import React from 'react';
import { EMProps, StrongProps } from './Text.props';

/**
 * lineheight
 * 1.9 p li
 *
 * 1.6818 h1 h2 h3
 *
 * 1.45 // Inline code
 * 1.5 // Image ToC Search Result
 *
 * 1.625 // Text Area Text Input
 */

const Text = styled('span', {
  margin: 0,
  padding: 0,
  textRendering: 'optimizeLegibility',

  variants: {
    // line heights / leading (define token)
    // rename space to tracking (define token)
    // composed variant => gradient = true => variant = default ?
    // Follow dynamic metrics https://rsms.me/inter/dynmetrics/
    outline: {
      true: {
        color: 'transparent !important',
        WebkitTextStrokeColor: 'var(--romaingrx-colors-typeface-primary)',
        WebkitTextStrokeWidth: '1px',
      },
    },
    spaced: {
      true: {
        letterSpacing: '0.3px',
        lineHeight: 1.9,
      },
    },
    family: {
      default: {
        fontFamily: 'inherit',
      },
      display: {
        fontFamily: 'var(--font-display)',
      },
      mono: {
        fontFamily: 'var(--font-mono)',
      },
      numeric: {
        fontFamily: 'var(--font-numeric)',
      },
    },
    size: {
      1: {
        fontSize: 'var(--font-size-1)',
      },
      2: {
        fontSize: 'var(--font-size-1)',
      },
      3: {
        fontSize: 'var(--font-size-3)',
      },
      4: {
        fontSize: 'var(--font-size-4)',
      },
      5: {
        fontSize: 'var(--font-size-5)',
      },
      6: {
        fontSize: 'var(--font-size-6)',
      },
      7: {
        fontSize: 'var(--font-size-7)',
      },
    },
    truncate: {
      true: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    variant: {
      default: { color: 'currentColor' },
      primary: { color: 'var(--romaingrx-colors-typeface-primary)' },
      secondary: { color: 'var(--romaingrx-colors-typeface-secondary)' },
      tertiary: { color: 'var(--romaingrx-colors-typeface-tertiary)' },
      info: { color: 'var(--romaingrx-colors-brand)' },
      success: { color: 'var(--romaingrx-colors-success)' },
      warning: { color: 'var(--romaingrx-colors-warning)' },
      danger: { color: 'var(--romaingrx-colors-danger)' },
    },
    weight: {
      2: {
        fontWeight: 'var(--font-weight-2)',
      },
      3: {
        fontWeight: 'var(--font-weight-3)',
      },
      4: {
        fontWeight: 'var(--font-weight-4)',
      },
    },
    gradient: {
      true: {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
    },
  },
  defaultVariants: {
    family: 'default',
    size: '3',
    variant: 'default',
    weight: '2',
    spaced: true,
  },
});

const EM = (props: EMProps) => {
  return (
    <Text
      {...props}
      as="em"
      variant="tertiary"
      weight="3"
      spaced={false}
      style={{
        letterSpacing: '-0.3px',
      }}
    />
  );
};

EM.displayName = 'EM';

const Strong = (props: StrongProps) => {
  return <Text {...props} as="strong" variant="primary" weight="4" />;
};

Strong.displayName = 'Strong';

export default Text;
export { EM, Strong };
