import React from 'react';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { Tooltip } from '@ui/components/Tooltip';
import { useIsOverflowing } from '@ui/utils/useIsOverflowing';
import { ChipTruncatableElement } from '../_shared/styles';
import type { ChipTruncatableProps } from '../_shared/types';

export const ChipTruncatable = ({
  children,
  className,
  background,
  borderColor,
  maxWidth,
  size,
  ...restSpanProps
}: ChipTruncatableProps) => {
  const { ref, isOverflowing } = useIsOverflowing<HTMLSpanElement>();

  const chip = (
    <ChipTruncatableElement
      {...restSpanProps}
      ref={ref}
      className={mergeClassNames(STATIC_CLASS_NAME.chip, className)}
      $background={background}
      $borderColor={borderColor}
      $maxWidth={maxWidth}
      $size={size}
    >
      {children}
    </ChipTruncatableElement>
  );

  if (isOverflowing) {
    return <Tooltip content={children}>{chip}</Tooltip>;
  }

  return chip;
};
