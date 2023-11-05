import { styled } from '@/design';
import { motion } from 'framer-motion';

const StyledConnectorHover = styled(motion.span, {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  borderRadius: 'var(--space-1)',
  backgroundColor:
    'var(--connector-hover-background, var(--romaingrx-colors-brand))',
});

const StyledConnector = styled('span', {
  position: 'relative',
  display: 'inline-block',
  height: 'var(--connector-height, 100%)',
  width: 'var(--connector-width, 0.25rem)',
  backgroundColor:
    'var(--connector-background, var(--romaingrx-colors-emphasis))',
  borderRadius: 'var(--space-1)',
  overflow: 'hidden',
});

export { StyledConnector, StyledConnectorHover };
