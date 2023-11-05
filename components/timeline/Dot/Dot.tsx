import { useRef, useState } from 'react';
import {
  StyledDot,
  StyledInnerDot,
  StyledInnerPulsatingDot,
} from './Dot.styles';
import { DotProps, DotVariant } from './Dot.types';
import { useInView } from 'framer-motion';

function InViewDot() {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
  });

  return (
    <StyledInnerDot
      ref={ref}
      initial={{
        opacity: 0.25
      }}
      animate={{
        opacity: inView
          ? 1.0
          : 0.25,
      }}
      exit={{
        opacity: 0.25
      }}
      transition={{
        delay: 0.5,
        duration: 1.0,
      }}
    />
  );
}

function getVariant(variant: DotVariant): React.FC {
  switch (variant) {
    case 'pulsating':
      return StyledInnerPulsatingDot;
    case 'inView':
      return InViewDot;
    case 'normal':
      return StyledInnerDot;
    default:
      throw new Error(`Unknown variant: ${variant}`);
  }
}

const Dot = ({ variant = 'inView', ...props }: DotProps) => {
  const InnerDot = getVariant(variant);
  return (
    <StyledDot {...props}>
      <InnerDot />
    </StyledDot>
  );
};

export { Dot };
