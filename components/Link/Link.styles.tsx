import { styled } from '@/design';
import Link from 'next/link';

const StyledLink = styled(Link, {
  position: 'relative;',
  decoration: 'none;',
  color: 'inherit;',
  width: 'fit-content;',
  // margin: '0 var(--spacing, 0px);',
  // transition: 'margin .25s;',
  svg: {
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
  variants: {
    variant: {
      default: {
        '--line': 'var(--romaingrx-colors-brand)',
        '--line-active': 'var(--romaingrx-colors-brand)',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export { StyledLink };
