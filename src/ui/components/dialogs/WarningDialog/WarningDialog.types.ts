import type React from 'react';

export type WarningDialogSize = 'small' | 'standard' | 'large' | 'extraLarge';

export type WarningDialogSeverity = 'success' | 'info' | 'warning' | 'error' | '';

type PrimaryActionButton = React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }>;
type SecondaryActionButton = React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export interface WarningDialogProps<T> extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
  autoFocusMode?: 'primary' | 'secondary' | 'close';
  children?: React.ReactNode;
  closeAction?: () => void;
  id?: string;
  initialState?: T;
  isLoading?: boolean;
  primaryAction?: (setDialogState: (newDialogState: T) => void, dialogState?: T) => void | Promise<void>; // @design-system TODO Promise check
  primaryButtonComponent?: PrimaryActionButton;
  primaryIsDisabled?: ((dialogState?: T) => boolean) | boolean;
  primaryIsLoading?: boolean;
  primaryLabel?: React.ReactNode;
  secondaryAction?: (setDialogState: (newDialogState: T) => void, dialogState?: T) => void | Promise<void>; // @design-system TODO Promise check
  secondaryButtonComponent?: SecondaryActionButton;
  secondaryIsDisabled?: ((dialogState?: T) => boolean) | boolean;
  secondaryLabel?: React.ReactNode;
  severity: WarningDialogSeverity;
  size?: WarningDialogSize;
  tertiaryRender?: (setDialogState: (newDialogState: T) => void, dialogState?: T) => React.ReactNode;
  title?: React.ReactNode;
  titleIcon?: React.ReactNode;
}
