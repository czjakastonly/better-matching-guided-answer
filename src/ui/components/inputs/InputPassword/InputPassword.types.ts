import type { Status } from '@ui/models';
import type { FieldTextProps } from '../FieldText';

type ForbiddenProps = 'aria-labelledby';

export interface InputPasswordProps extends Omit<FieldTextProps, ForbiddenProps> {
  className?: string;
  message?: string;
  label?: string;
  id?: string;
  required?: boolean;
  status?: Status;
  tooltip?: React.ReactNode;
}
