import type { Status } from '@ui/models';

import { type FieldTextareaAiProps } from '../FieldTextareaAi';

type ForbiddenProps = 'aria-labelledby';

export interface InputTextareaAiProps extends Omit<FieldTextareaAiProps, ForbiddenProps> {
  className?: string;
  id?: string;
  label?: React.ReactNode;
  message?: React.ReactNode;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
}
