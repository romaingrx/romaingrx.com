"use client"

import { CardProps } from './Card.props';
import { StyledCard } from './Card.styles';

function Card({ depth, glass, hoverable, children, ...props }: CardProps) {
  return (
    <StyledCard depth={depth} glass={glass} hoverable={hoverable} {...props}>
      {children}
    </StyledCard>
  );
}

export default Card;
