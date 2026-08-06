import type { Status } from '@ui/models';

/* Props that are used internally and won't work anyway */
type ForbiddenProps = 'label' | 'className' | 'type' | 'aria-invalid' | 'readOnly' | 'style';

export interface FieldTextareaAiProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, ForbiddenProps> {
  disabled?: boolean;
  maxLength?: number;
  minRows?: number;
  name?: string;
  /**
   * When provided:
   * - Enter triggers this callback (instead of inserting a newline)
   * - Ctrl+Enter keeps default behavior (new line)
   */
  onEnterPressed?: () => void;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onChangeValue?: (val: string, name?: string) => void;
  status?: Status | false;
  actionButtonIcon?: React.ReactNode;
  handleActionButtonClick?: () => void;
  value?: string;
}
