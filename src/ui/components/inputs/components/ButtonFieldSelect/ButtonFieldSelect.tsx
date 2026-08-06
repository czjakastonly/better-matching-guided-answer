import React, { forwardRef, useRef } from 'react';
import { useTheme } from 'styled-components';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import TriangleSVG from '@ui/atoms/icons/TriangleArrowDown-12.svg';
import {
  renderStatusIconForInputStatus,
  resolveMessageColorForInputStatus,
} from '@ui/components/inputs/_shared/helpers';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { FieldStyles } from '../../_shared/Field.styles';
import Base from './ButtonFieldSelect.styles';
import type { ButtonFieldSelectProps } from './ButtonFieldSelect.types';

/**
 * A button to be used as dropdown trigger (looks like input with arrow down) for input-like-looking dropdowns
 */
export const ButtonFieldSelect = forwardRef<HTMLButtonElement, ButtonFieldSelectProps>(
  (
    {
      label,
      children,
      disabled,
      iconLeft,
      iconUnits,
      isOpen,
      isPlaceholder,
      onClick,
      required,
      status,
      tabIndex = 0,
      additionalActionNode,
      className,
      ...htmlButtonProps
    },
    forwardedRef
  ) => {
    const theme = useTheme();

    const buttonInternalRef = useRef<HTMLButtonElement>(null);
    const buttonRef = useMergeRefs(buttonInternalRef, forwardedRef);

    const statusIcon = renderStatusIconForInputStatus(status);
    const statusColor = resolveMessageColorForInputStatus(theme, status);
    const borderColor = statusColor || (isOpen ? theme.color.borderDefaultHover : undefined);

    return (
      <FieldStyles.FieldWrap $borderColor={borderColor}>
        <Base.ButtonElement
          {...htmlButtonProps}
          className={mergeClassNames(STATIC_CLASS_NAME.field, className)}
          $isPlaceholder={isPlaceholder}
          aria-expanded={isOpen}
          isOpen={isOpen}
          aria-invalid={status === 'error'}
          aria-required={required}
          disabled={disabled}
          onClick={onClick}
          ref={buttonRef}
          tabIndex={tabIndex}
          type="button"
        >
          {iconLeft && <FieldStyles.IconLeftWrap aria-hidden>{iconLeft}</FieldStyles.IconLeftWrap>}
          <Base.Text>{label || children}</Base.Text>
          {iconUnits && <FieldStyles.IconUnitsWrap aria-hidden>{iconUnits}</FieldStyles.IconUnitsWrap>}
          {statusIcon && (
            <FieldStyles.IconRightWrap aria-hidden $color={statusColor}>
              {statusIcon}
            </FieldStyles.IconRightWrap>
          )}
          <FieldStyles.IconRightWrap aria-hidden>
            <TriangleSVG />
          </FieldStyles.IconRightWrap>
        </Base.ButtonElement>
        {!!additionalActionNode && (
          <FieldStyles.ButtonElementWrap>{additionalActionNode}</FieldStyles.ButtonElementWrap>
        )}
      </FieldStyles.FieldWrap>
    );
  }
);
