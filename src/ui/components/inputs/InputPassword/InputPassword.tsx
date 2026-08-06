import React, { forwardRef, useRef, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import EyeIconSVG from '@ui/atoms/icons/Eye-16.svg';
import EyeCrossedIconSVG from '@ui/atoms/icons/Eye-crossed-16.svg';
import { generateLabelDomId, generateDescribeDomId, useDomId } from '@ui/utils/domId';
import { TooltipIcon, type TooltipIconHandles } from '@ui/components/Tooltip';

import type { InputPasswordProps } from './InputPassword.types';
import { FieldText } from '../FieldText';

const eyeIconStyle = css`
  cursor: pointer;
  path {
    transition: fill 0.2s;
  }

  &:hover {
    path {
      fill: ${({ theme }) => theme.color.iconHover};
    }
  }
`;

const EyeIcon = styled(EyeIconSVG)`
  ${eyeIconStyle}
`;

const EyeIconCrossed = styled(EyeCrossedIconSVG)`
  ${eyeIconStyle}
`;

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  (
    { className, id: domId, label, message, required, status, tooltip, onFocus, onBlur, ...restFieldTextProps },
    forwardedRef
  ) => {
    const id = useDomId(domId);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const describedbyDomId = generateDescribeDomId(id, !!message);
    const labelDomId = generateLabelDomId(id, !!label);
    const tooltipRef = useRef<TooltipIconHandles>(null);

    const onFocusProxy = (e: React.FocusEvent<HTMLInputElement>) => {
      tooltipRef.current?.open?.();
      onFocus?.(e);
    };

    const onBlurProxy = (e: React.FocusEvent<HTMLInputElement>) => {
      tooltipRef.current?.close?.();
      onBlur?.(e);

      setIsPasswordShown(false);
    };

    useEffect(() => {
      if (restFieldTextProps.value) {
        tooltipRef.current?.open?.();
      }
    }, [restFieldTextProps.value]);

    return (
      <InputWrap
        className={className}
        label={
          <>
            {label}
            {tooltip && <TooltipIcon ref={tooltipRef}>{tooltip}</TooltipIcon>}
          </>
        }
        labelDomId={labelDomId}
        message={message}
        messageDomId={describedbyDomId}
        required={required}
        status={status}
      >
        <FieldText
          {...restFieldTextProps}
          aria-describedby={describedbyDomId}
          aria-labelledby={labelDomId}
          onBlur={onBlurProxy}
          onFocus={onFocusProxy}
          id={id}
          ref={forwardedRef}
          required={required}
          status={status}
          type={isPasswordShown ? 'text' : 'password'}
          iconRight={
            isPasswordShown ? (
              <EyeIconCrossed
                tabIndex={0}
                role="switch"
                onClick={() => setIsPasswordShown(false)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setIsPasswordShown(false);
                  }
                }}
              />
            ) : (
              <EyeIcon
                tabIndex={0}
                role="switch"
                onClick={() => setIsPasswordShown(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setIsPasswordShown(true);
                  }
                }}
              />
            )
          }
        />
      </InputWrap>
    );
  }
);
