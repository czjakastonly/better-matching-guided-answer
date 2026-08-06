import type React from 'react';

import { type SelectOptionPayload, type SelectTriggerMandatoryProps } from './_shared/types';

interface SelectProviderProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  filterLogic?: (phrase: string, optionPayload?: SelectOptionPayload) => boolean;
  id?: string;
  name?: string;
  maxHeightPx?: number;
  minWidthRatio?: number;
  maxWidthRatio?: number;
  onChangeValue?: (value: string, name?: string) => void;
  onClose?: () => void;
  placeholder?: string;
  renderIconLeft?: (selectedPayload?: SelectOptionPayload) => React.ReactNode;
  renderLabel?: (selectedPayload?: SelectOptionPayload) => React.ReactNode;
  value: string;
  widthPx?: number;
  isFlipDisabled?: boolean;
}

export type SelectProps<TriggerProps> = Omit<
  TriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof SelectTriggerMandatoryProps
> &
  SelectProviderProps & { placeholderSearch?: string };
