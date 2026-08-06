import React from 'react';
import PlusSVG from '@ui/atoms/icons/Plus-16.svg';
import type { ButtonDropzoneProps } from './ButtonDropzone.types';
import { ButtonStyles } from '../_shared/styles';
import { Loader } from '../components/Loader';

export const ButtonDropzone = React.forwardRef<HTMLButtonElement, ButtonDropzoneProps>(
  (
    {
      children,
      disabled,
      iconLeft = <PlusSVG />,
      iconOnly,
      iconRight,
      isLoading,
      isPressed,
      label = children,
      onClick,
      ...restHtmlButtonProps
    },
    forwardedRef
  ) => {
    const isDisabled = isLoading || disabled;
    const handleClick = isDisabled ? undefined : onClick;

    return (
      <ButtonStyles.DropzoneButtonElement
        {...restHtmlButtonProps}
        ref={forwardedRef}
        disabled={isDisabled}
        onClick={handleClick}
        isPressed={isPressed}
        isIconOnly={!!iconOnly}
        isLoading={isLoading}
        type="button"
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
            <ButtonStyles.TextWrap>{label}</ButtonStyles.TextWrap>
            {iconRight && <ButtonStyles.IconWrapRight aria-hidden>{iconRight}</ButtonStyles.IconWrapRight>}
          </>
        )}
      </ButtonStyles.DropzoneButtonElement>
    );
  }
);
