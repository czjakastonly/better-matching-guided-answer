import type { Status } from '@ui/models';
import { type FieldDateProps } from '../FieldDate';

type ForbiddenProps = 'aria-labelledby' | 'aria-describedby';

export interface InputDateProps extends Omit<FieldDateProps, ForbiddenProps> {
  className?: string;
  id?: string;
  label?: React.ReactNode;
  message?: React.ReactNode;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
}
