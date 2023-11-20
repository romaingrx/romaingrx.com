'use client';
import { useTheme } from 'next-themes';
import { PillProps } from './Pill.props';
import { StyledPill } from './Pill.styles';

const Pill = (props: PillProps) => {
  const { children, variant } = props;
  const { resolvedTheme } = useTheme();
  console.log({ resolvedTheme, variant });

  return (
    <StyledPill {...props} dark={resolvedTheme === 'dark'} variant={variant}>
      {children}
    </StyledPill>
  );
};

export default Pill;
