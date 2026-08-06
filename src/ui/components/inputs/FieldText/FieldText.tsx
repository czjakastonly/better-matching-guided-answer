import React, { forwardRef, useRef } from 'react';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import { useTheme } from 'styled-components';
import {
  renderStatusIconForInputStatus,
  resolveIconColorForInputStatus,
  resolveBorderColorForInputStatus,
} from '@ui/components/inputs/_shared/helpers';
import { STATIC_CLASS_NAME } from '@ui/constants';

import { FieldStyles } from '../_shared/Field.styles';
import type { FieldTextProps } from './FieldText.types';

export const FieldText = forwardRef<HTMLInputElement, FieldTextProps>(
  (
    {
      additionalActionNode,
      disabled,
      iconLeft,
      iconRight,
      iconUnits,
      name,
      onChange,
      onChangeValue,
      status,
      tabIndex,
      value = '',
      type = 'text',
      ...restInputHtmlProps
    },
    forwardedRef
  ) => {
    const inputRefInternal = useRef<HTMLInputElement>(null);
    const inputRef = useMergeRefs<HTMLInputElement>(inputRefInternal, forwardedRef);

    const theme = useTheme();

    const statusIcon = renderStatusIconForInputStatus(status);
    const statusIconColor = resolveIconColorForInputStatus(theme, status);
    const statusBorderColor = resolveBorderColorForInputStatus(theme, status);

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
      <FieldStyles.FieldWrap $borderColor={statusBorderColor}>
        <FieldStyles.InputElementWrap $disabled={disabled} onClick={handleContainerClick}>
          {iconLeft && <FieldStyles.IconLeftWrap aria-hidden>{iconLeft}</FieldStyles.IconLeftWrap>}
          <FieldStyles.InputElement
            {...restInputHtmlProps}
            aria-invalid={status === 'error'}
            className={STATIC_CLASS_NAME.field}
            disabled={disabled}
            name={name}
            onChange={handleChange}
            readOnly={!onChange && !onChangeValue}
            ref={inputRef}
            tabIndex={tabIndex}
            type={type}
            value={value}
          />
          {iconUnits && <FieldStyles.IconUnitsWrap aria-hidden>{iconUnits}</FieldStyles.IconUnitsWrap>}
          {statusIcon && !additionalActionNode && (
            <FieldStyles.IconRightWrap aria-hidden $color={statusIconColor}>
              {statusIcon}
            </FieldStyles.IconRightWrap>
          )}
          {iconRight && <FieldStyles.IconRightWrap aria-hidden>{iconRight}</FieldStyles.IconRightWrap>}
        </FieldStyles.InputElementWrap>
        {!!additionalActionNode && (
          <FieldStyles.ButtonElementWrap>{additionalActionNode}</FieldStyles.ButtonElementWrap>
        )}
      </FieldStyles.FieldWrap>
    );
  }
);
