import type React from 'react';
import type { Status } from '@ui/models';

/* Props that are used internally and won't work anyway */
type ForbiddenProps = 'label' | 'className' | 'type' | 'aria-invalid' | 'readOnly' | 'autoComplete';

export interface FieldNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ForbiddenProps> {
  additionalActionNode?: React.ReactNode;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconUnits?: React.ReactNode;
  integerOnly?: boolean;
  max?: number;
  min?: number;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onChangeValue?: (val: string, name?: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  status?: Status | false;
  tabIndex?: number;
  value?: string;
}
