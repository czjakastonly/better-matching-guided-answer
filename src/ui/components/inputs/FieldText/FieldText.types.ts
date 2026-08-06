import type React from 'react';
import type { Status } from '@ui/models';

/* Props that are used internally and won't work anyway */
type ForbiddenProps = 'label' | 'type' | 'aria-invalid' | 'readOnly';

export interface FieldTextProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ForbiddenProps> {
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconUnits?: React.ReactNode;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onChangeValue?: (val: string, name?: string) => void;
  status?: Status | false;
  tabIndex?: number;
  value?: string;
  additionalActionNode?: React.ReactNode;
  type?: string;
}
