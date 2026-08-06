import { type ListItemStandardProps } from '@ui/components/List';
import type React from 'react';

/** Data that will be passed to renderLabel, renderIconLeft callback */
export interface SelectOptionPayload {
  value: string;
  iconLeft?: React.ReactNode;
  label?: string;
  description?: string;
}

/** Props that component that will be used as trigger must handle (they will be used internally) */
export interface SelectTriggerMandatoryProps {
  'aria-controls'?: string;
  iconLeft?: React.ReactNode;
  isOpen?: boolean;
  isPlaceholder?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  className?: string;
}

type ReservedInternalOptionProps = 'isHighlighted' | 'isSelected' | 'onClick';
export type OptionProps = Omit<ListItemStandardProps, ReservedInternalOptionProps> & SelectOptionPayload;

export interface SelectInteractionsContainerProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: React.ReactNode;
  id?: string;
  shouldShowSearch?: boolean;
  searchValue: string;
  searchOnChangeValue?: (value: string) => void;
  searchPlaceholder?: string;
  maxHeightPx?: number;
}

/* Props for the useSelectOption hook */
export interface UseSelectOptionOptions<T> {
  uuid?: string;
  disabled?: boolean;
  payload?: T;
  value?: string;
}
