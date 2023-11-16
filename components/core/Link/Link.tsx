'use client';
import { StyledLink } from './Link.styles';
import { LinkProps } from './Link.types';

function Link({ children, ...props }: LinkProps) {
  const controlPoint1 = '';
  return (
    <StyledLink {...props}>
      {children}
      <svg viewBox="0 0 70 36" preserveAspectRatio='none'>
        <path
          d={
            `M8.9739 30.8153` +
            `H63.0244` +
            `C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531` +
            `C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153` +
            `C104.062 35.3153 54.5169 -6.68469 23.489 9.31527`
          }
        />
      </svg>
    </StyledLink>
  );
}

export default Link;
