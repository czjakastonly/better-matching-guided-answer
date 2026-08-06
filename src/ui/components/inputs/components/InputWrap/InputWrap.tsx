import React from 'react';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { TooltipIcon } from '@ui/components/Tooltip/TooltipIcon';
import HelpSVG from '@ui/atoms/icons/Help-16.svg';

import {
  renderMessageStatusIconForInputStatus,
  resolveIconColorForInputStatus,
  resolveMessageColorForInputStatus,
} from '@ui/components/inputs/_shared/helpers';
import { useTheme } from 'styled-components';
import Base from './InputWrap.styles';
import type { InputWrapProps } from './InputWrap.types';

/**
 * Wrapper for a single FieldXX that makes it InputXX - which means label on top, colored message on bottom etc.
 */
export const InputWrap = ({
  labelDomId,
  messageDomId,
  required,
  children,
  status,
  message,
  label,
  className,
  tooltip,
}: InputWrapProps) => {
  const theme = useTheme();
  const statusIcon = renderMessageStatusIconForInputStatus(status);
  const statusIconColor = resolveIconColorForInputStatus(theme, status);
  const statusMessageColor = resolveMessageColorForInputStatus(theme, status);
  return (
    <Base.InputContainer
      className={mergeClassNames(className, STATIC_CLASS_NAME.inputWrap)}
      withMessageBelow={!!message}
    >
      {label && (
        <Base.InputLabel>
          <span id={labelDomId} className={STATIC_CLASS_NAME.inputLabel}>
            {label}
          </span>
          {required && label && <Base.InputRequiredLabelSuffix aria-hidden>*</Base.InputRequiredLabelSuffix>}
          {tooltip && <TooltipIcon as={HelpSVG}>{tooltip}</TooltipIcon>}
        </Base.InputLabel>
      )}
      {children}
      {message && (
        <Base.InputMessageWrap
          className={STATIC_CLASS_NAME.inputMessage}
          id={messageDomId}
          $textColor={statusMessageColor}
          aria-live="polite"
          data-status={status}
        >
          {statusIcon && (
            <Base.InputMessageIconWrap aria-hidden $color={statusIconColor}>
              {statusIcon}
            </Base.InputMessageIconWrap>
          )}
          {message}
        </Base.InputMessageWrap>
      )}
    </Base.InputContainer>
  );
};
