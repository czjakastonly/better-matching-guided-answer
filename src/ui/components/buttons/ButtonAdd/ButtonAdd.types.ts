import type { ButtonSize } from '../_shared/types';

type ForbiddenProps = 'type';

export interface ButtonAddProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ForbiddenProps> {
  children?: React.ReactNode;
  /** redundant to children */
  label?: string;
  size?: ButtonSize;
  isPressed?: boolean;
}
