"use client"

import { CardProps } from './Card.props';
import { StyledCard } from './Card.styles';

function Card({ depth, glass, children, ...props }: CardProps) {
  return (
    <StyledCard depth={depth} glass={glass} {...props}>
      {children}
    </StyledCard>
  );
}

export default Card;
