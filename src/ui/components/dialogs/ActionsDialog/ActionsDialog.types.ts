import type React from 'react';

export type ActionsDialogSize = 'small' | 'standard' | 'large' | 'extraLarge' | 'custom';

type PrimaryActionButton = React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }>;
type SecondaryActionButton = React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export interface ActionsDialogProps<T> extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
  [key: `data-${string}`]: string;
  autoFocusMode?: 'primary' | 'secondary' | 'close';
  children?: React.ReactNode;
  closeAction?: () => void;
  contentWrapMode?: 'standard' | 'nopadding';
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
  /** Show line separator between header and content. If empty, it will show up on scroll only */
  showHeaderDivider?: boolean;
  size?: ActionsDialogSize;
  customSize?: number;
  tertiaryRender?: (setDialogState: (newDialogState: T) => void, dialogState?: T) => React.ReactNode;
  title?: React.ReactNode;
  titleIcon?: React.ReactNode;
}
