import { type Status } from '@ui/models';

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  severity?: Status;
  hasIcon?: boolean;
  dataCy?: string;
  onCloseClick?: () => void;
}

export interface ToastProps extends NotificationProps {
  onActionClick?: () => void;
}
