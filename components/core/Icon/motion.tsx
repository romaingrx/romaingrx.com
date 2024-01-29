import React from 'react';
import { motion, Transition, SVGMotionProps, AnimatePresence } from 'framer-motion';
import { IconProps } from '.';
import { StyledSVG } from './Icon.styles';

export function MotionCheckIcon({
  isVisible,
  duration = 0.3,
  initial = true,
  strokeWidth = 1.5,
  ...props
}: IconProps & {
  isVisible: boolean;
  duration?: number;
  initial?: boolean;
  strokeWidth?: number;
}) {
  return (
    <AnimatePresence initial={initial}>
      {isVisible && (
        <StyledSVG
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          {...props}
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{
              type: 'tween',
              duration: duration,
              ease: isVisible ? 'easeOut' : 'easeIn',
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </StyledSVG>
      )}
    </AnimatePresence>
  );
}


interface Props extends SVGMotionProps<SVGSVGElement> {
  isOpen?: boolean;
  color?: string;
  strokeWidth?: string | number;
  transition?: Transition;
  lineProps?: any;
}

export function MenuButton({
  isOpen = false,
  width = 24,
  height = 24,
  strokeWidth = 1,
  color = '',
  transition = {
    type: 'spring',
    stiffness: 260,
    damping: 20,
  },
  lineProps = null,
  ...props
}: Props) {
  const variant = isOpen ? 'opened' : 'closed';
  const top = {
    closed: {
      rotate: 0,
      translateY: 0,
    },
    opened: {
      rotate: 45,
      translateY: 2,
    },
  };
  const center = {
    closed: {
      opacity: 1,
    },
    opened: {
      opacity: 0,
    },
  };
  const bottom = {
    closed: {
      rotate: 0,
      translateY: 0,
    },
    opened: {
      rotate: -45,
      translateY: -2,
    },
  };
  lineProps = {
    strokeWidth: strokeWidth as number,
    vectorEffect: 'non-scaling-stroke',
    initial: 'closed',
    animate: variant,
    transition,
    ...lineProps,
  };
  if (color) {
    lineProps.stroke = color;
  }
  const unitHeight = 4;
  const unitWidth = (unitHeight * (width as number)) / (height as number);

  return (
    <motion.svg
      viewBox={`0 0 ${unitWidth} ${unitHeight}`}
      overflow="visible"
      preserveAspectRatio="none"
      width={width}
      height={height}
      {...props}
    >
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="0"
        y2="0"
        variants={top}
        {...lineProps}
      />
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="2"
        y2="2"
        variants={center}
        {...lineProps}
      />
      <motion.line
        x1="0"
        x2={unitWidth}
        y1="4"
        y2="4"
        variants={bottom}
        {...lineProps}
      />
    </motion.svg>
  );
}
