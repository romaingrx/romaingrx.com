import { VariantProps, styled } from '@/design';
import Link from 'next/link';

const StyledLink = styled(Link, {
  position: 'relative',
  display: 'inline-block',
  color: 'inherit',
  width: 'fit-content',
  // margin: '0 var(--spacing, 0px);',
  // transition: 'margin .25s;',
  '#box': {
    display: 'flex;',
    alignItems: 'center;',
    gap: 'var(--spacing, 0.25rem);',
  },
  '#startIcon, #endIcon': {
    transition: 'transform .4s, color .1s;',
  },
  '&:hover #startIcon, &:focus #startIcon': {
    transform:
      'translateX(calc(var(--translateX, 0px) * -1)) translateY(calc(var(--translateY, 0px) * -1));',
    color: 'var(--romaingrx-colors-brand)',
  },
  '&:hover #endIcon, &:focus #endIcon': {
    transform:
      'translateX(var(--translateX, 0px)) translateY(calc(var(--translateY, 0px) * -1));',
    color: 'var(--romaingrx-colors-brand)',
  },

  variants: {
    variant: {
      underline: {
        '--line': 'var(--romaingrx-colors-brand)',
        '--line-active': 'var(--romaingrx-colors-brand)',

        '& svg': {
          position: 'absolute;',
          width: '120%;',
          height: '140%;',
          left: '-10%;',
          bottom: '-15%;',
          fill: 'none;',
          stroke: 'var(--stroke, var(--line));',
          strokeLinecap: 'round',
          strokeWidth: '2px',
          'stroke-dasharray': 'var(--offset, 68px) 278px;',
          'stroke-dashoffset': '360px;',
          transition:
            'stroke .25s ease var(--stroke-delay, 0s), stroke-dasharray .35s;',
        },

        '&:hover, &:focus': {
          '--spacing': '4px;',
          '--stroke': 'var(--line-active);',
          '--stroke-delay': '.1s;',
          '--offset': '180px;',
        },
      },
      none: {
        '--translateX': '2px;',
        '--translateY': '0px;',
      },
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
});

export type LinkVariant = VariantProps<typeof StyledLink>['variant'];

export { StyledLink };
