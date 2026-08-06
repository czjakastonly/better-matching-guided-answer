import type { ButtonSize } from '../_shared/types';

export interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
