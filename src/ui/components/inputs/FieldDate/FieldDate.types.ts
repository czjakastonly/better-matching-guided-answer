import type { Status } from '@ui/models';
import type { CalendarProps } from '@ui/components/Calendar';

export interface FieldDateProps extends Omit<CalendarProps, 'onChange' | 'onSelect'> {
  disabled?: boolean;
  name?: string;
  onChange?: (date?: Date) => void;
  id?: string;
  required?: boolean;
  status?: Status | false;
  dateFormat?: string;
}
