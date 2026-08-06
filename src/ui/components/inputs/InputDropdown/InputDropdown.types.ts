import type { DropdownProps } from '@ui/components/Dropdown';
import type { Status } from '@ui/models';
import type { ButtonFieldSelectProps } from '../components/ButtonFieldSelect';

export type InputDropdownProps = {
  children: React.ReactNode;
  className?: string;
  labelTrigger?: React.ReactNode;
  message?: React.ReactNode;
  onBlur?: never; // if you plan to implement it, keep in mind that dropdown moves focus out of it. Play with isOpen?
  placeholder?: React.ReactNode;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
  iconLeft?: React.ReactNode;
} & DropdownProps<ButtonFieldSelectProps>;
