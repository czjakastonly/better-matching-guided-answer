import type { SelectProps } from '@ui/components/Select';
import type { Status } from '@ui/models';
import type { ButtonFieldSelectProps } from '../components/ButtonFieldSelect';

type ForbiddenProps = 'aria-labelledby';

export interface InputSelectProps extends Omit<SelectProps<ButtonFieldSelectProps>, ForbiddenProps> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  label?: React.ReactNode;
  message?: React.ReactNode;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
}
