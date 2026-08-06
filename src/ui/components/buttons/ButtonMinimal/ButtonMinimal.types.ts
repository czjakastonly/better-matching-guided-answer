import type { ButtonSize } from '../_shared/types';

type ForbiddenProps = 'type';

export interface ButtonMinimalProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ForbiddenProps> {
  children?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconOnly?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  isPressed?: boolean;
  /** redundant to children */
  label?: string;
  size?: ButtonSize;
}
