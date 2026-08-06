import type { Status } from '@ui/models';
import { type FieldSearchProps } from '../FieldSearch';

type ForbiddenProps = 'aria-labelledby';

export interface InputSearchProps extends Omit<FieldSearchProps, ForbiddenProps> {
  className?: string;
  id?: string;
  label?: React.ReactNode;
  message?: React.ReactNode;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
}
