import type { Status } from '@ui/models';

/* Props that are used internally and won't work anyway */
type ForbiddenProps = 'className' | 'aria-invalid' | 'readOnly' | 'aria-describedby' | 'value' | 'labelField';

export interface TickProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  checked?: boolean;
  statusBorderColor?: string;
  indeterminate?: boolean;
}

export interface FieldCheckProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ForbiddenProps> {
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  label: React.ReactNode;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onChangeChecked?: (isChecked: boolean, name?: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  required?: boolean;
  status?: Status | false;
  tabIndex?: number;
  tooltip?: React.ReactNode;
  type: 'checkbox' | 'radio';
  indeterminate?: boolean;
  message?: React.ReactNode;
}
