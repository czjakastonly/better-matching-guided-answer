import React, { useRef } from 'react';
import { useTheme } from 'styled-components';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import {
  renderStatusIconForInputStatus,
  resolveIconColorForInputStatus,
  resolveBorderColorForInputStatus,
} from '@ui/components/inputs/_shared/helpers';
import { STATIC_CLASS_NAME } from '@ui/constants';
import type { FieldTextareaProps } from './FieldTextarea.types';
import { FieldTextAreaStyles } from './FieldTextarea.styles';
import { FieldStyles } from '../_shared/Field.styles';

export const FieldTextarea = React.forwardRef<HTMLTextAreaElement, FieldTextareaProps>(
  (
    { disabled, name, value, onChange, onChangeValue, status, minRows = 3, maxLength, ...restTextAreaHtmlProps },
    forwardedRef
  ) => {
    const inputRefInternal = useRef<HTMLTextAreaElement>(null);
    const inputRef = useMergeRefs<HTMLTextAreaElement>(inputRefInternal, forwardedRef);

    const theme = useTheme();

    const statusIcon = renderStatusIconForInputStatus(status);
    const statusIconColor = resolveIconColorForInputStatus(theme, status);
    const statusBorderColor = resolveBorderColorForInputStatus(theme, status);

    const handleContainerClick = () => {
      if (inputRefInternal.current) {
        inputRefInternal.current.focus();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!disabled) {
        onChange?.(e);
        onChangeValue?.(e.target.value, name);
      }
    };

    return (
      <FieldTextAreaStyles.FieldWrap
        $borderColor={statusBorderColor}
        $disabled={disabled}
        onClick={handleContainerClick}
      >
        <FieldTextAreaStyles.TextareaAutosizeElement
          {...restTextAreaHtmlProps}
          aria-invalid={status === 'error'}
          className={STATIC_CLASS_NAME.field}
          disabled={disabled}
          maxLength={maxLength}
          minRows={minRows}
          name={name}
          onChange={handleChange}
          readOnly={!onChange && !onChangeValue}
          ref={inputRef}
          value={value}
        />
        {statusIcon && (
          <FieldStyles.IconRightWrap aria-hidden $color={statusIconColor}>
            {statusIcon}
          </FieldStyles.IconRightWrap>
        )}
      </FieldTextAreaStyles.FieldWrap>
    );
  }
);
