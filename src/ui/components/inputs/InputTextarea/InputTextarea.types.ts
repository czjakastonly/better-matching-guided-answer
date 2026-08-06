import type { Status } from '@ui/models';

import type { FieldTextareaProps } from '../FieldTextarea';

type ForbiddenProps = 'aria-labelledby';

export interface InputTextareaProps extends Omit<FieldTextareaProps, ForbiddenProps> {
  className?: string;
  id?: string;
  label?: React.ReactNode;
  message?: React.ReactNode;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
}
