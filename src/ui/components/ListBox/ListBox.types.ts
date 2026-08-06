import type React from 'react';
import type { HTMLAttributes } from 'react';

/*
  Props that wannabe ListBoxInteractionContainer component must handle
  BUT these won't be allowed on actual (resulted) ListBoxInteractionContainer.
*/
export interface ListBoxInteractionContainerInternalProps {
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  // ref must be here
}

/*
  Props that actual ListBoxInteractionContainer (created with withListBoxInteractionContainerInternalProps) must handle
*/
export interface ListBoxInteractionContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof ListBoxInteractionContainerInternalProps> {
  autoFocus?: boolean;
  children?: React.ReactNode;
}

/*
  Props that wannabe ListBoxOption component must handle
  BUT these won't be allowed on actual ListBoxOption
*/
export interface ListBoxOptionInternalProps {
  isHighlighted?: boolean;
  isSelected?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface ListBoxOptionProps<P, T = P> {
  uuid?: string;
  disabled?: boolean;
  payload?: T;
  action?: (payload?: T, uuid?: string) => void;
  value?: string;
}

/*
  FYI
  (ListBoxOption component takes these props AND all the props, that rendering component (e.g. ListItemStandard) handle except ListBoxOptionInternalProps )
*/
export interface UseListBoxOptionOptions<T> {
  uuid?: string;
  disabled?: boolean;
  payload?: T;
  action?: (payload?: T, uuid?: string) => void;
  value?: string;
}

export interface ListBoxProps<P = unknown>
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof ListBoxInteractionContainerInternalProps> {
  value?: string | string[];
  children?: React.ReactNode;
  onAction?: (payload: P) => void;
  onPostAction?: () => void;
  autoFocus?: boolean;
}
