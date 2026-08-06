import React, { forwardRef, useRef } from 'react';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import { useTheme } from 'styled-components';
import SearchIconSVG from '@ui/atoms/icons/Search-16.svg';
import CrossIconSVG from '@ui/atoms/icons/Cross-16.svg';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import { STATIC_CLASS_NAME } from '@ui/constants';
import {
  renderStatusIconForInputStatus,
  resolveIconColorForInputStatus,
  resolveBorderColorForInputStatus,
} from '../_shared/helpers';
import { FieldStyles } from '../_shared/Field.styles';
import type { FieldSearchProps } from './FieldSearch.types';

export const FieldSearch = forwardRef<HTMLInputElement, FieldSearchProps>(
  (
    {
      additionalActionNode,
      disabled,
      iconUnits,
      name,
      onChange,
      onChangeValue,
      status,
      tabIndex,
      value = '',
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

    const handleClear = () => {
      if (!disabled) {
        onChangeValue?.('', name);
      }
    };

    return (
      <FieldStyles.FieldWrap $borderColor={statusBorderColor}>
        <FieldStyles.InputElementWrap $disabled={disabled} onClick={handleContainerClick}>
          <FieldStyles.IconLeftWrap aria-hidden>
            <SearchIconSVG />
          </FieldStyles.IconLeftWrap>
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
            type="text"
            value={value}
          />
          {iconUnits && <FieldStyles.IconUnitsWrap aria-hidden>{iconUnits}</FieldStyles.IconUnitsWrap>}
          {statusIcon && !additionalActionNode && (
            <FieldStyles.IconRightWrap aria-hidden $color={statusIconColor}>
              {statusIcon}
            </FieldStyles.IconRightWrap>
          )}
          {value && onChangeValue && (
            <FieldStyles.IconRightWrap aria-hidden>
              <ButtonMinimal onClick={handleClear} iconOnly={<CrossIconSVG />} tabIndex={-1} />
            </FieldStyles.IconRightWrap>
          )}
        </FieldStyles.InputElementWrap>
        {!!additionalActionNode && (
          <FieldStyles.ButtonElementWrap>{additionalActionNode}</FieldStyles.ButtonElementWrap>
        )}
      </FieldStyles.FieldWrap>
    );
  }
);
