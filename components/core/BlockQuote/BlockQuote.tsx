'use client';
import { QuoteIcon } from '@/components/core/Icon/Icon';
import {
  StyledBlockQuote,
  StyledBlockQuoteScreenWidth,
  StyledBlockQuoteText,
  StyledBlockQuoteWrapper,
} from './BlockQuote.styles';
import { BlockQuoteProps } from './BlockQuote.types';

const getVariantIcon = (icon: BlockQuoteProps['variant']) => {
  switch (icon) {
    case 'classy':
      return <QuoteIcon size={7} />;
    default:
      return null;
  }
};

const BlockQuote = ({
  children,
  label,
  variant = 'classy',
  screenWidth = true,
  css,
}: BlockQuoteProps) => {
  const icon = label || getVariantIcon(variant);

  const subBlockQuote = (
    <StyledBlockQuote variant={variant} css={css}>
      <StyledBlockQuoteWrapper variant={variant}>
        {icon}
      </StyledBlockQuoteWrapper>
      <StyledBlockQuoteText>{children}</StyledBlockQuoteText>
    </StyledBlockQuote>
  );
  return screenWidth ? (
    <StyledBlockQuoteScreenWidth>{subBlockQuote}</StyledBlockQuoteScreenWidth>
  ) : (
    <>{subBlockQuote}</>
  );
};

export default BlockQuote;
