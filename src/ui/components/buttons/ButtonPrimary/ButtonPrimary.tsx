import React from 'react';

import { ButtonStyles } from '../_shared/styles';
import { Loader } from '../components/Loader';
import type { ButtonPrimaryProps } from './ButtonPrimary.types';

export const ButtonPrimary = React.forwardRef<HTMLButtonElement, ButtonPrimaryProps>(
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
      type = 'button',
      ...restHtmlButtonProps
    },
    forwardedRef
  ) => {
    const isDisabled = isLoading || disabled;
    const handleClick = isDisabled ? undefined : onClick;

    return (
      <ButtonStyles.PrimaryButtonElement
        {...restHtmlButtonProps}
        disabled={isDisabled}
        onClick={handleClick}
        ref={forwardedRef}
        isPressed={isPressed}
        isIconOnly={!!iconOnly}
        isLoading={isLoading}
        $size={size}
        type={type}
      >
        {isLoading && (
          <ButtonStyles.IconWrapLoader aria-hidden>
            <Loader isDark={false} />
          </ButtonStyles.IconWrapLoader>
        )}

        {iconOnly && <ButtonStyles.IconWrapOnly aria-hidden>{iconOnly}</ButtonStyles.IconWrapOnly>}

        {!iconOnly && (
          <>
            {iconLeft && <ButtonStyles.IconWrapLeft aria-hidden>{iconLeft}</ButtonStyles.IconWrapLeft>}
            <ButtonStyles.TextWrap>{label}</ButtonStyles.TextWrap>
            {iconRight && <ButtonStyles.IconWrapRight aria-hidden>{iconRight}</ButtonStyles.IconWrapRight>}
          </>
        )}
      </ButtonStyles.PrimaryButtonElement>
    );
  }
);
