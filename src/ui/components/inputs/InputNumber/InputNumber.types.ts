import type { Status } from '@ui/models';
import type { FieldNumberProps } from '../FieldNumber';

type ForbiddenProps = 'aria-describedby' | 'aria-labelledby';

export interface InputNumberProps extends Omit<FieldNumberProps, ForbiddenProps> {
  className?: string;
  id?: string;
  label?: React.ReactNode;
  message?: React.ReactNode;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
}
