import { CSS } from '@/design';

type ButtonVariants = 'primary' | 'secondary';
type ButtonTypes = 'normal' | 'icon';
type ButtonSizes = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  size?: ButtonSizes;
  contentType?: ButtonTypes;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  css?: CSS;
}

export type { ButtonProps, ButtonVariants };
