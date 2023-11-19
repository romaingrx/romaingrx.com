import { styled, shadows } from "@/design";
import { Card } from "@nextui-org/react";

export const StyledCard = styled(Card, {
  position: 'relative',
  background:
    'var(--card-background, var(--romaingrx-card-background-color))',
  backdropFilter: 'var(--card-blur, none)',
  borderRadius: 'var(--border-radius-2)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--romaingrx-border-color)',
  overflow: 'hidden',

  "&:hover": {
    '--card-shadow': shadows[3],
  },

  variants: {
    glass: {
      true: {
        '--card-background': 'var(--romaingrx-colors-foreground)',
        '--card-blur': 'blur(6px)',
      },
    },
    depth: {
      0: {
        '--card-shadow': shadows[0],
      },
      1: {
        '--card-shadow': shadows[1],
      },
      2: {
        '--card-shadow': shadows[2],
      },
      3: {
        '--card-shadow': shadows[3],
      },
    },
  },
  defaultVariants: {
    depth: 1,
  },
});