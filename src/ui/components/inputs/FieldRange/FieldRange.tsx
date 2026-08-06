import React, { useRef } from 'react';
import { useMergeRefs } from '@ui/utils/mergeRefs';
import { STATIC_CLASS_NAME } from '@ui/constants';
import FieldRangeStyles from './FieldRange.styles';
import type { FieldRangeProps } from './FieldRange.types';

export const FieldRange = React.forwardRef<HTMLInputElement, FieldRangeProps>(
  (
    {
      disabled,
      max = 100,
      min = 0,
      name,
      onChange,
      onChangeValue,
      status,
      step = 1,
      tabIndex = 0,
      value,
      ...restHtmlInputProps
    },
    forwardedRef
  ) => {
    const inputRefInternal = useRef<HTMLInputElement>(null);
    const inputRef = useMergeRefs<HTMLInputElement>(inputRefInternal, forwardedRef);

    const valueNum = Number(value);
    const range = valueNum ? ((valueNum - min) * 100) / (max - min) : 0;

    const handleContainerClick = () => {
      if (inputRefInternal.current) {
        inputRefInternal.current.focus();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange?.(e);
        onChangeValue?.(e.target.value, name);
      }
    };

    return (
      <FieldRangeStyles.Container onClick={handleContainerClick} tabIndex={-1}>
        <FieldRangeStyles.BarBg />
        <FieldRangeStyles.Bar style={{ width: `${range}%` }} />
        <FieldRangeStyles.Slider
          {...restHtmlInputProps}
          className={STATIC_CLASS_NAME.field}
          aria-invalid={status === 'error'}
          disabled={disabled}
          max={max}
          min={min}
          name={name}
          onChange={handleChange}
          ref={inputRef}
          step={step}
          type="range"
          value={valueNum}
          tabIndex={tabIndex}
        />
      </FieldRangeStyles.Container>
    );
  }
);
