import { motion } from 'framer-motion';
import { keyframes, styled } from '@/design';

const StyledDot = styled('div', {
  width: 'var(--dot-size, 1.5rem)',
  height: 'var(--dot-size, 1.5rem)',
  backgroundColor: 'var(--dot-background, var(--romaingrx-colors-body))',
  padding: 'var(--dot-padding, 0.25rem)',
  flexShrink: 0,
  overflow: 'visible',
});

const StyledInnerDot = styled(motion.div, {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: 'var(--inner-dot-size, 100%)',
  height: 'var(--inner-dot-size, 100%)',
  borderRadius: '50%',
  backgroundColor: 'var(--inner-dot-background, var(--romaingrx-colors-brand))',
});

const pulse = keyframes({
  '0%': {
    transform: 'scale(0.9)',
    boxShadow: '0 0 0 0 var(--inner-dot-background, var(--romaingrx-colors-success))',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 0.4rem rgba(0, 0, 0, 0)',
  },
  '100%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
  },
});

const StyledInnerPulsatingDot = styled('div', {
  width: 'var(--inner-dot-size, 100%)',
  height: 'var(--inner-dot-size, 100%)',
  borderRadius: '50%',
  backgroundColor:
    'var(--inner-dot-background, var(--romaingrx-colors-success))',
  animation: `${pulse} 2s infinite`,
});

export { StyledDot, StyledInnerDot, StyledInnerPulsatingDot };
