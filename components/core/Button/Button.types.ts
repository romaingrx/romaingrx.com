import { CSS } from "@/design";

type ButtonVariants = 'primary' | 'secondary';
type ButtonTypes = 'normal' | 'icon';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  disabled?: boolean;
  type?: ButtonTypes;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  css?: CSS;
}

export type { ButtonProps, ButtonVariants };
