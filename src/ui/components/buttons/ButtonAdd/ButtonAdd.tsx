import React from 'react';
import PlusSVG from '@ui/atoms/icons/Plus-16.svg';
import * as Base from './ButtonAdd.styles';
import type { ButtonAddProps } from './ButtonAdd.types';

export const ButtonAdd = React.forwardRef<HTMLButtonElement, ButtonAddProps>(
  (
    { tabIndex = 0, onClick, children, size = 'small', disabled, isPressed, label = children, ...buttonHtmlAttributes },
    forwardedRef
  ) => {
    const handleClick = disabled ? undefined : onClick;

    return (
      <Base.ButtonElement
        {...buttonHtmlAttributes}
        ref={forwardedRef}
        tabIndex={tabIndex}
        aria-disabled={disabled}
        disabled={disabled}
        size={size}
        onClick={handleClick}
        isPressed={isPressed}
      >
        <Base.IconWrap size={size} aria-hidden>
          <PlusSVG />
        </Base.IconWrap>
        <Base.Text>{label}</Base.Text>
      </Base.ButtonElement>
    );
  }
);
