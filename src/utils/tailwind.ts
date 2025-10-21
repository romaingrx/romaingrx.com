import React, { Children, cloneElement, isValidElement } from 'react';
import { tailwindToCSS } from 'tw-to-css';

const { twj } = tailwindToCSS({
  config: {
    theme: {
      extend: {
        colors: {},
        borderRadius: {},
        backgroundImage: {},
        keyframes: {
          'pulse-slow': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.5' },
          },
          'up-down': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          ripple: {
            '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
            '50%': { transform: 'translate(-50%, -50%) scale(0.9)' },
          },
        },
        animation: {
          'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          'up-down': 'up-down 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          ripple: 'ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite',
        },
      },
    },
  },
});

export function inlineTailwind(el: React.JSX.Element): React.JSX.Element {
  const { className, children, style: originalStyle, ...props } = el.props;
  // Generate style from the `tw` prop
  const twStyle = className ? twj(className.split(' ')) : {};
  // Merge original and generated styles
  const mergedStyle = { ...originalStyle, ...twStyle };
  // Recursively process children
  const processedChildren = Children.map(children, (child) =>
    isValidElement(child) ? inlineTailwind(child as React.JSX.Element) : child
  );
  // Return cloned element with updated props
  return cloneElement(
    el,
    { ...props, style: mergedStyle, className: className },
    processedChildren
  );
}
