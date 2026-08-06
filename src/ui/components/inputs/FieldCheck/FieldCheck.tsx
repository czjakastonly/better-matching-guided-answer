import React, { forwardRef, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import {
  renderMessageStatusIconForInputStatus,
  resolveIconColorForInputStatus,
  resolveMessageColorForInputStatus,
  resolveBorderColorForInputStatus,
} from '@ui/components/inputs/_shared/helpers';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { generateDescribeDomId, useDomId } from '@ui/utils/domId';
import { useMergeRefs } from '@ui/utils/mergeRefs';
import { TooltipIcon } from '@ui/components/Tooltip/TooltipIcon';
import HelpSVG from '@ui/atoms/icons/Help-16.svg';
import FieldCheckStyles from './FieldCheck.styles';
import type { FieldCheckProps } from './FieldCheck.types';
import { TickCheckboxRect } from './TickCheckboxRect';
import { TickRadioCircle } from './TickRadioCircle';

const allowedTypeList = ['radio', 'checkbox'] as Array<FieldCheckProps['type']>;

export const FieldCheck = forwardRef<HTMLInputElement, FieldCheckProps>(
  (
    {
      checked,
      disabled,
      id: domId,
      label,
      name,
      onChange,
      onChangeChecked,
      onKeyDown,
      required,
      status,
      tooltip,
      type,
      message,
      indeterminate = false,
      ...restHtmlCheckboxProps
    },
    forwardedRef
  ) => {
    const theme = useTheme();
    const statusIcon = renderMessageStatusIconForInputStatus(status);
    const statusIconColor = resolveIconColorForInputStatus(theme, status);
    const statusBorderColor = resolveBorderColorForInputStatus(theme, status);
    const statusMessageColor = resolveMessageColorForInputStatus(theme, status);
    const id = useDomId(domId);
    const messageDomId = generateDescribeDomId(id, !!message);

    const inputRefInternal = useRef<HTMLInputElement>(null);
    const inputRef = useMergeRefs<HTMLInputElement>(inputRefInternal, forwardedRef);

    if (!allowedTypeList.includes(type)) {
      // just in case
      throw new Error(`STON.ERR - FieldCheck type is incorrect: "${type}"`);
    }

    const TickComponent = type === 'radio' ? TickRadioCircle : TickCheckboxRect;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        const newChecked = !checked;
        onChange?.(e);
        onChangeChecked?.(newChecked, name);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.key === 'Enter') {
        handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };

    useEffect(() => {
      if (inputRefInternal.current) {
        inputRefInternal.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <FieldCheckStyles.FieldCheckWrap>
        <FieldCheckStyles.LabelWrap>
          <FieldCheckStyles.LabelElement $disabled={disabled} htmlFor={id}>
            <FieldCheckStyles.InputElement
              aria-describedby={messageDomId}
              {...restHtmlCheckboxProps}
              className={mergeClassNames(STATIC_CLASS_NAME.field, STATIC_CLASS_NAME.fieldCheck)}
              aria-invalid={status === 'error'}
              disabled={disabled}
              id={id}
              name={name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              required={required}
              type="checkbox"
              checked={!!checked}
            />
            <TickComponent
              aria-hidden
              disabled={disabled}
              checked={!!checked}
              statusBorderColor={statusBorderColor}
              className={FieldCheckStyles.TICK_ICON_CLASS}
              indeterminate={indeterminate}
            />
            <FieldCheckStyles.Text>
              {label}
              {required && <FieldCheckStyles.RequiredLabelSuffix aria-hidden>*</FieldCheckStyles.RequiredLabelSuffix>}
            </FieldCheckStyles.Text>
          </FieldCheckStyles.LabelElement>
          {tooltip && (
            <FieldCheckStyles.TooltipWrap>
              <TooltipIcon as={HelpSVG}>{tooltip}</TooltipIcon>
            </FieldCheckStyles.TooltipWrap>
          )}
        </FieldCheckStyles.LabelWrap>
        {message && (
          <FieldCheckStyles.InputMessageWrap
            className={STATIC_CLASS_NAME.inputMessage}
            id={messageDomId}
            $textColor={statusMessageColor}
            aria-live="polite"
            data-status={status}
          >
            {statusIcon && (
              <FieldCheckStyles.InputMessageIconWrap aria-hidden $color={statusIconColor}>
                {statusIcon}
              </FieldCheckStyles.InputMessageIconWrap>
            )}
            {message}
          </FieldCheckStyles.InputMessageWrap>
        )}
      </FieldCheckStyles.FieldCheckWrap>
    );
  }
);
