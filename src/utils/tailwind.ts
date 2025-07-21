import React, { Children, cloneElement, isValidElement } from 'react';
import { tailwindToCSS, type TailwindConfig } from 'tw-to-css';

const { twj } = tailwindToCSS({
  config: (await import('../../tailwind.config.mjs')).default as TailwindConfig,
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
