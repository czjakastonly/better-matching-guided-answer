import React, { forwardRef, useRef, useState } from 'react';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import { useTheme } from 'styled-components';
import {
  renderStatusIconForInputStatus,
  resolveBorderColorForInputStatus,
  resolveIconColorForInputStatus,
} from '@ui/components/inputs/_shared/helpers';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { FieldStyles } from '../_shared/Field.styles';
import type { FieldNumberProps } from './FieldNumber.types';
import { Arrows } from './Arrows';

const ARROW_KEY = {
  down: 'ArrowDown',
  up: 'ArrowUp',
};

export const FieldNumber = forwardRef<HTMLInputElement, FieldNumberProps>(
  (
    {
      disabled,
      iconLeft,
      iconUnits,
      integerOnly = false,
      max = Number.MAX_SAFE_INTEGER,
      min = 0,
      name = '',
      onChangeValue,
      onKeyDown,
      status,
      tabIndex,
      value = '',
      additionalActionNode,
      ...restInputHtmlProps
    },
    forwardedRef
  ) => {
    if (min > max) {
      throw new Error(`STON_UI_ERROR: FieldNumber min >= max ${JSON.stringify({ min, max })}`);
    }
    const theme = useTheme();

    const inputRefInternal = useRef<HTMLInputElement>(null);
    const inputRef = useMergeRefs<HTMLInputElement>(inputRefInternal, forwardedRef);
    const [arrowHoldingKey, setArrowHoldingKey] = useState('');

    const statusIcon = renderStatusIconForInputStatus(status);
    const statusIconColor = resolveIconColorForInputStatus(theme, status);
    const statusBorderColor = resolveBorderColorForInputStatus(theme, status);

    const resetArrowHoldingKey = () => {
      setArrowHoldingKey('');
    };

    const parseValue = (val: unknown) => {
      const valueToUse = typeof val === 'string' && integerOnly ? val.replace('.', '') : val;

      const parsedValue = Number(valueToUse);
      return Number.isNaN(parsedValue) ? 0 : parsedValue;
    };

    const triggerChangeValue = (val: string) => {
      if (!disabled) {
        onChangeValue?.(val, name);
        return undefined;
      }
    };

    const updateValue = (val: string | number) => {
      if (val === '') {
        triggerChangeValue?.(val);
        return undefined;
      }
      const parsedValue = parseValue(val);
      let finalValue = parsedValue;
      if (parsedValue >= max) {
        // falsy for max = NaN
        finalValue = max;
      }
      if (parsedValue <= min) {
        // falsy for min = NaN
        finalValue = min;
      }
      triggerChangeValue?.(String(finalValue));
    };

    const incrementCurrentValue = () => {
      updateValue(parseValue(value) + 1);
    };

    const decrementCurrentValue = () => {
      updateValue(parseValue(value) - 1);
    };

    const handleContainerClick = () => {
      if (inputRefInternal.current) {
        inputRefInternal.current.focus();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateValue(e.target.value);
    };

    /** decrement/increment and highlight proper arrow when pressed */
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);

      if (e.key === ARROW_KEY.up) {
        e.preventDefault(); // prevent cursor moving to the beginning once UP key pressed
        incrementCurrentValue();
        setArrowHoldingKey(e.key);
      } else if (e.key === ARROW_KEY.down) {
        e.preventDefault(); // prevent cursor moving to the beginning once UP key pressed
        decrementCurrentValue();
        setArrowHoldingKey(e.key);
      } else {
        resetArrowHoldingKey();
      }
    };

    const parsedValue = value === '' ? '' : String(parseValue(value)); // String is needed because component will not rerender if val 02 -> 2

    return (
      <FieldStyles.FieldWrap $borderColor={statusBorderColor}>
        <FieldStyles.InputElementWrap onClick={handleContainerClick} $disabled={disabled}>
          {iconLeft && <FieldStyles.IconLeftWrap aria-hidden>{iconLeft}</FieldStyles.IconLeftWrap>}
          <FieldStyles.InputElement
            {...restInputHtmlProps}
            aria-invalid={status === 'error'}
            autoComplete="off"
            className={STATIC_CLASS_NAME.field}
            disabled={disabled}
            name={name}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onKeyUp={resetArrowHoldingKey}
            readOnly={!onChangeValue}
            ref={inputRef}
            tabIndex={tabIndex}
            type="number"
            value={parsedValue}
          />
          {iconUnits && <FieldStyles.IconUnitsWrap aria-hidden>{iconUnits}</FieldStyles.IconUnitsWrap>}
          {statusIcon && !additionalActionNode && (
            <FieldStyles.IconRightWrap aria-hidden $color={statusIconColor}>
              {statusIcon}
            </FieldStyles.IconRightWrap>
          )}
          <FieldStyles.IconRightWrap aria-hidden>
            <Arrows
              disabled={disabled}
              isDownActive={arrowHoldingKey === ARROW_KEY.down}
              isUpActive={arrowHoldingKey === ARROW_KEY.up}
              onDownClick={decrementCurrentValue}
              onUpClick={incrementCurrentValue}
            />
          </FieldStyles.IconRightWrap>
        </FieldStyles.InputElementWrap>
        {!!additionalActionNode && (
          <FieldStyles.ButtonElementWrap>{additionalActionNode}</FieldStyles.ButtonElementWrap>
        )}
      </FieldStyles.FieldWrap>
    );
  }
);
