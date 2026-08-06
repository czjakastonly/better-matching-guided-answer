import type React from 'react';
import type { Status } from '@ui/models';

/* Props that are used internally and won't work anyway */
type ForbiddenProps = 'label' | 'className' | 'type' | 'aria-invalid' | 'readOnly' | 'autoComplete';

export interface FieldRangeProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ForbiddenProps> {
  disabled?: boolean;
  max?: number;
  min?: number;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onChangeValue?: (val: string, name?: string) => void;
  status?: Status | false;
  step?: number;
  tabIndex?: number;
  value?: string;
}
