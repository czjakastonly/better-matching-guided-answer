import type React from 'react';

import { type SelectOptionPayload, type SelectTriggerMandatoryProps } from './_shared/types';

/** Data that will be passed to renderLabel, renderIconLeft callback */

export type SelectMultipleProps<TriggerProps> = Omit<
  TriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof SelectTriggerMandatoryProps
> & {
  as?: React.ElementType;
  children?: React.ReactNode;
  filterLogic?: (phrase: string, optionPayload?: SelectOptionPayload) => boolean;
  id?: string;
  name?: string;
  labelApply?: string;
  labelCancel?: string;
  maxHeightPx?: number;
  maxWidthRatio?: number;
  onChangeValueList?: (valueList: string[], name?: string) => void;
  onClose?: () => void;
  placeholder?: string;
  placeholderSearch?: string;
  renderIconLeft?: (selectedPayloadList?: SelectOptionPayload[]) => React.ReactNode;
  renderLabel?: (selectedPayload?: SelectOptionPayload[]) => React.ReactNode;
  valueList: string[];
  widthPx?: number;
};
