import { CSS } from '@/design';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'info' | 'danger' | 'success' | 'warning';
  css?: CSS;
}