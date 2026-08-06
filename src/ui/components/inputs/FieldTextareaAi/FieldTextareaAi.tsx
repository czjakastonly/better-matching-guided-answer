import React, { useRef } from 'react';
import { useTheme } from 'styled-components';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import { resolveBorderColorForInputStatus } from '@ui/components/inputs/_shared/helpers';
import { STATIC_CLASS_NAME } from '@ui/constants';
import type { FieldTextareaAiProps } from './FieldTextareaAi.types';
import { FieldTextareaAiStyles } from './FieldTextareaAi.styles';

export const FieldTextareaAi = React.forwardRef<HTMLTextAreaElement, FieldTextareaAiProps>(
  (
    {
      disabled,
      name,
      value,
      onEnterPressed,
      onChange,
      onChangeValue,
      status,
      minRows = 1,
      maxLength,
      actionButtonIcon,
      handleActionButtonClick,
      onKeyDown,
      ...restTextAreaHtmlProps
    },
    forwardedRef
  ) => {
    const inputRefInternal = useRef<HTMLTextAreaElement>(null);
    const inputRef = useMergeRefs<HTMLTextAreaElement>(inputRefInternal, forwardedRef);

    const theme = useTheme();

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

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = e => {
      onKeyDown?.(e);

      if (e.key !== 'Enter' || e.isPropagationStopped() || e.defaultPrevented) {
        return;
      }

      if (e.ctrlKey) {
        if (onEnterPressed) {
          // Keep newline behavior deterministic when Enter is repurposed for submit.
          e.preventDefault();
          e.stopPropagation();

          const textarea = e.currentTarget;
          const start = textarea.selectionStart ?? 0;
          const end = textarea.selectionEnd ?? 0;

          textarea.setRangeText('\n', start, end, 'end');
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return;
      }

      if (onEnterPressed && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        (onEnterPressed as () => void)();
      }
    };

    return (
      <FieldTextareaAiStyles.FieldWrap
        $borderColor={statusBorderColor}
        $disabled={disabled}
        onClick={handleContainerClick}
      >
        <FieldTextareaAiStyles.TextareaAutosizeElement
          {...restTextAreaHtmlProps}
          aria-invalid={status === 'error'}
          className={STATIC_CLASS_NAME.field}
          disabled={disabled}
          maxLength={maxLength}
          minRows={minRows}
          name={name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={!onChange && !onChangeValue}
          ref={inputRef}
          value={value}
        />
        {actionButtonIcon && handleActionButtonClick && (
          <FieldTextareaAiStyles.ActionButton onClick={handleActionButtonClick}>
            {actionButtonIcon}
          </FieldTextareaAiStyles.ActionButton>
        )}
      </FieldTextareaAiStyles.FieldWrap>
    );
  }
);
