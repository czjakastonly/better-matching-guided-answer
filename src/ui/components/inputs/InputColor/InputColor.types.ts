import type { Status } from '@ui/models';
import type { FieldTextProps } from '../FieldText';

type ForbiddenProps = 'aria-labelledby' | 'additionalActionNode' | 'iconRight';

export interface InputColorProps extends Omit<FieldTextProps, ForbiddenProps> {
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: React.ReactNode;
  message?: React.ReactNode;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
  value?: string;
}
