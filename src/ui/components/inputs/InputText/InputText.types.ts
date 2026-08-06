import type { Status } from '@ui/models';
import type { FieldTextProps } from '../FieldText';

type ForbiddenProps = 'aria-labelledby' | 'aria-describedby';

export interface InputTextProps extends Omit<FieldTextProps, ForbiddenProps> {
  className?: string;
  message?: React.ReactNode;
  label?: React.ReactNode;
  id?: string;
  required?: boolean;
  status?: false | Status;
  tooltip?: React.ReactNode;
}
