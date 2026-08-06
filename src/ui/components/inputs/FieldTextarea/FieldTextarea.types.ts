import type { Status } from '@ui/models';

/* Props that are used internally and won't work anyway */
type ForbiddenProps = 'label' | 'className' | 'type' | 'aria-invalid' | 'readOnly' | 'style';

export interface FieldTextareaProps extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, ForbiddenProps> {
  disabled?: boolean;
  maxLength?: number;
  minRows?: number;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onChangeValue?: (val: string, name?: string) => void;
  status?: Status | false;
  value?: string;
}
