import { styled } from '@/design';
import { motion } from 'framer-motion';

const StyledConnectorHover = styled(motion.span, {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  backgroundColor:
    'var(--connector-hover-background, var(--romaingrx-colors-brand))',
  zIndex: 0,
});

const StyledConnectorChildren = styled('div', {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: 'auto',
  zIndex: 1,
});

const StyledConnector = styled('span', {
  position: 'relative',
  display: 'inline-block',
  height: 'var(--connector-height, 100%)',
  width: 'var(--connector-width, 0.25rem)',
  backgroundColor:
    'var(--connector-background, var(--romaingrx-colors-emphasis))',
});

export { StyledConnector, StyledConnectorHover, StyledConnectorChildren };
