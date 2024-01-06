'use client';
import React from 'react';
import { ButtonProps } from './Button.types';
import { StyledButton } from './Button.styles';

const Button = ({
  children,
  disabled,
  startIcon,
  endIcon,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton {...props}>
      {startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </StyledButton>
  );
};

export default Button;
