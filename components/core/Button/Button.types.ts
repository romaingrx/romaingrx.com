import { CSS } from "@/design";

type ButtonVariants = 'primary' | 'secondary';
type ButtonTypes = 'normal' | 'icon';
type ButtonSizes = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  size?: ButtonSizes;
  type?: ButtonTypes;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  css?: CSS;
}

export type { ButtonProps, ButtonVariants };
