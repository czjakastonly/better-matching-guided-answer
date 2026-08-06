import type { Status } from '@ui/models';

export interface InputWrapProps {
  children: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  labelDomId?: string;
  message?: React.ReactNode;
  messageDomId?: string;
  required?: boolean;
  status?: Status | false;
  tooltip?: React.ReactNode;
}
