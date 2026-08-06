import React from 'react';

import { Loader } from '@ui/components/buttons/components/Loader';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import type { ButtonAdditionalActionProps } from './ButtonAdditionalAction.types';
import { FieldStyles } from '../../_shared/Field.styles';
import ButtonAdditionalActionStyles from './ButtonAdditionalAction.styles';

/**
 * An icon button to be used as 'additionalAction' field parameter
 * It will be displayed to the right of input field with proper styling
 */
export const ButtonAdditionalAction = React.forwardRef<HTMLButtonElement, ButtonAdditionalActionProps>(
  (
    { disabled, iconOnly, isLoading, isPressed, onClick, children, className, ...restHtmlButtonProps },
    forwardedRef
  ) => {
    const isDisabled = isLoading || disabled;
    const handleClick = isDisabled ? undefined : onClick;

    return (
      <ButtonAdditionalActionStyles.ButtonElement
        {...restHtmlButtonProps}
        className={mergeClassNames(STATIC_CLASS_NAME.fieldButtonAdditionalAction, className)}
        disabled={disabled}
        onClick={handleClick}
        ref={forwardedRef}
        isPressed={isPressed}
      >
        {isLoading && (
          <FieldStyles.IconWrap aria-hidden>
            <Loader isDark />
          </FieldStyles.IconWrap>
        )}
        {!isLoading && iconOnly && <FieldStyles.IconWrap aria-hidden>{iconOnly}</FieldStyles.IconWrap>}
        {!isLoading && !iconOnly && children}
      </ButtonAdditionalActionStyles.ButtonElement>
    );
  }
);
