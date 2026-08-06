import type React from 'react';

export type FieldToggleSize = 'small' | 'standard';

/* Props that are:
   - used internally
   - OR not implemented yet
   - OR native will be overridden (like size)

   andwon't work anyway
 */
type ForbiddenProps = 'type' | 'label' | 'size';

export interface FieldToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ForbiddenProps> {
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onChangeChecked?: (isChecked: boolean, name?: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  required?: boolean;
  tabIndex?: number;
  size?: FieldToggleSize;
}
