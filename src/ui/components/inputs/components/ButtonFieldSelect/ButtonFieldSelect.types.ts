import type React from 'react';
import type { Status } from '@ui/models';

type ReservedProps =
  | 'aria-expanded'
  | 'aria-invalid'
  | 'aria-required'
  | 'children'
  | 'disabled'
  | 'label'
  | 'onClick'
  | 'required'
  | 'style'
  | 'type';

export interface ButtonFieldSelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ReservedProps> {
  additionalActionNode?: React.ReactNode;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconUnits?: React.ReactNode;
  isOpen?: boolean;
  isPlaceholder?: boolean;
  onClick?: () => void;
  required?: boolean;
  status?: Status | false;
  children?: React.ReactNode;
  label?: React.ReactNode;
}
