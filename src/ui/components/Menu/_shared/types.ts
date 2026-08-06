import { type ListItemStandardProps } from '@ui/components/List';
import type { DropdownFloatingOptions } from '@ui/components/Dropdown';
import type React from 'react';

/** Props that component that will be used as trigger must handle (they will be used internally) */
export interface MenuTriggerMandatoryProps {
  'aria-controls'?: string;
  iconLeft?: React.ReactNode;
  isOpen?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
}

type ReservedInternalActionProps =
  | 'isHighlighted'
  | 'onClick'
  | 'aria-disabled'
  | 'data-activedescendant'
  | 'role'
  | 'data-h-pri'
  | 'data-h-dis'
  | 'data-h-uuid';

export type ActionProps<Payload = undefined> = Omit<ListItemStandardProps, ReservedInternalActionProps> & {
  payload?: Payload;
  action?: (payload?: Payload) => void;
};

interface MenuProviderProps<Payload> {
  as?: React.ElementType;
  children?: React.ReactNode;
  id?: string;
  name?: string;
  minWidthRatio?: number;
  maxHeightPx?: number;
  maxWidthRatio?: number;
  onAction?: (payload?: Payload, uuid?: string) => void;
  onClose?: () => void;
  onOpen?: () => void;
  widthPx?: number;
  isFlipDisabled?: boolean;
  placement?: DropdownFloatingOptions['placement'];
}

export type MenuProps<TriggerProps, Payload> = Omit<
  TriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof MenuTriggerMandatoryProps
> &
  MenuProviderProps<Payload>;

export interface MenuInteractionsContainerProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: React.ReactNode;
  id?: string;
  maxHeightPx?: number;
}

/* Props for the useMenuAction hook */
export interface UseMenuActionOptions<T> {
  action?: (payload?: T) => void;
  disabled?: boolean;
  payload?: T;
  uuid?: string;
}
