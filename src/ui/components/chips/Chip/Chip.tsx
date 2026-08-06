import React from 'react';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { ChipElement } from '../_shared/styles';
import type { ChipProps } from '../_shared/types';

export const Chip = ({ children, className, background, borderColor, size, ...restSpanProps }: ChipProps) => (
  <ChipElement
    {...restSpanProps}
    className={mergeClassNames(STATIC_CLASS_NAME.chip, className)}
    $background={background}
    $borderColor={borderColor}
    $size={size}
  >
    {children}
  </ChipElement>
);
