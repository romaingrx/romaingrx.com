'use client';
import React from 'react';
import { ButtonProps } from './Button.types';
import { StyledButton } from './Button.styles';

const Button = ({ children, startIcon, endIcon, ...props }: ButtonProps) => {
  return (
    <StyledButton {...props}>
      {startIcon && <span id="startIcon">{startIcon}</span>}
      <span id="children">{children}</span>
      {endIcon && <span id="endIcon">{endIcon}</span>}
    </StyledButton>
  );
};

export default Button;
