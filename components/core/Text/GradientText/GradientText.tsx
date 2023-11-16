'use client';
import { StyledGradientText } from './GradientText.styles';
import { GradientTextProps } from './GradientText.types';

function GradientText({ children, css, variant }: GradientTextProps) {
  return (
    <>
      <StyledGradientText css={css} variant={variant}>
        {children}
      </StyledGradientText>
    </>
  );
}

export { GradientText };
