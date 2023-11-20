'use client';

import { CardProps } from './Card.props';
import { StyledCard } from './Card.styles';

function Card({ children, ...props }: CardProps) {
  return <StyledCard {...props}>{children}</StyledCard>;
}

export default Card;
