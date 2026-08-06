import type React from 'react';

export type AllowedClosingKey = 'Escape' | 'Tab' | 'ArrowDown' | 'ArrowUp' | 'Enter';

export interface DropdownFloatingOptions {
  /**
   * keyboard key that will close dropdown. Escape & Tab by default
   */
  closingKeyList?: AllowedClosingKey[];

  isFlipDisabled?: boolean;

  /**
   * Extend container by pixels. It has impact on position.left, width, minWidth, maxWidth
   */
  widthExtendPx?: number;

  mainAxisOffset?: number;

  /**
   * Max width compared to trigger width. Default 1
   */
  maxWidthRatio?: number;

  /**
   * Min width compared to trigger width. Default 1
   */
  minWidthRatio?: number;

  onOpen?: () => void;

  onClose?: () => void;

  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start';

  strategy?: 'fixed' | 'absolute';

  /**
   * static dropdown width (w)
   */
  widthPx?: number;

  isFocusLocked?: boolean;
}

/** Props that component that will be used as trigger must handle (they will be used internally) */
export interface DropdownTriggerMandatoryProps
  extends Pick<React.HtmlHTMLAttributes<HTMLElement>, 'aria-expanded' | 'aria-controls' | 'onClick' | 'onKeyDown'> {
  iconLeft?: React.ReactNode;
  isOpen?: boolean; // compat - it is better to use isPressed instead
  isPressed?: boolean;
}

interface FloatingDropdownOwnProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  id?: string;
}

export type DropdownProps<TriggerProps> = Omit<TriggerProps, keyof DropdownTriggerMandatoryProps> &
  FloatingDropdownOwnProps &
  DropdownFloatingOptions;

export interface FloatingDropdownHandles extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  close: () => void;
  open: () => void;
  isOpen: boolean;
}

export interface DropdownContextValue {
  close: () => void;
  open: () => void;
}
