import React from 'react';

import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { ButtonStyles } from '../_shared/styles';
import { Loader } from '../components/Loader';
import type { ButtonMinimalProps } from './ButtonMinimal.types';

export const ButtonMinimal = React.forwardRef<HTMLButtonElement, ButtonMinimalProps>(
  (
    {
      children,
      disabled,
      iconLeft,
      iconOnly,
      iconRight,
      isLoading,
      isPressed,
      label = children,
      onClick,
      size = 'standard',
      className,
      ...restHtmlButtonProps
    },
    forwardedRef
  ) => {
    const isDisabled = isLoading || disabled;
    const handleClick = isDisabled ? undefined : onClick;

    return (
      <ButtonStyles.MinimalButtonElement
        {...restHtmlButtonProps}
        disabled={isDisabled}
        onClick={handleClick}
        ref={forwardedRef}
        isPressed={isPressed}
        isIconOnly={!!iconOnly}
        isLoading={isLoading}
        $size={size}
        type="button"
        className={mergeClassNames(STATIC_CLASS_NAME.buttonMinimal, className)}
      >
        {isLoading && (
          <ButtonStyles.IconWrapLoader aria-hidden>
            <Loader isDark />
          </ButtonStyles.IconWrapLoader>
        )}
        {iconOnly && <ButtonStyles.IconWrapOnly aria-hidden>{iconOnly}</ButtonStyles.IconWrapOnly>}
        {!iconOnly && (
          <>
            {iconLeft && <ButtonStyles.IconWrapLeft aria-hidden>{iconLeft}</ButtonStyles.IconWrapLeft>}
            {label !== undefined && <ButtonStyles.TextWrap>{label}</ButtonStyles.TextWrap>}
            {iconRight && <ButtonStyles.IconWrapRight aria-hidden>{iconRight}</ButtonStyles.IconWrapRight>}
          </>
        )}
      </ButtonStyles.MinimalButtonElement>
    );
  }
);
