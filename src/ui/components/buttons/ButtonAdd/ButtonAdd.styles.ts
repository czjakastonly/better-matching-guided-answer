import styled, { css } from 'styled-components';

import type { ButtonSize } from '../_shared/types';
import { focusButtonOutlineStyle } from '../_shared/styles';

const IconWrap = styled.div<{ size?: ButtonSize; isPressed?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ size }) => (size === 'standard' ? '10px' : '6px')};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.backgroundDefault};
  border: 1px solid ${({ theme }) => theme.color.borderDefault};
  transition: background-color 0.2s, border-color 0.2s;
  svg path {
    transition: fill 0.2s;
  }
`;

const ButtonElement = styled.button<{
  disabled?: boolean;
  size?: ButtonSize;
  isPressed?: boolean;
}>`
  font-family: inherit;
  border-style: none;
  border-radius: 16px;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none;
  transition: color 0.2s;
  background: none;
  width: fit-content;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.color.textDefault};
  cursor: pointer;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color 0.2s;

  &:focus-visible {
    ${focusButtonOutlineStyle}
  }

  ${({ size }) => {
    if (size === 'standard') {
      return css`
        font-size: 16px;
        gap: 16px;
      `;
    }
    if (size === 'small') {
      return css`
        font-size: 14px;
        gap: 12px;
      `;
    }
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `}


  &:hover {
    color: ${({ theme }) => theme.color.textHover};
    ${IconWrap} {
      background-color: ${({ theme }) => theme.color.backgroundGreenDefault};
      border-color: ${({ theme }) => theme.color.backgroundGreenDefault};
      svg path {
        fill: ${({ theme }) => theme.color.iconDefaultInverse};
      }
    }
  }

  &:active {
    color: ${({ theme }) => theme.color.textHover};
    ${IconWrap} {
      background-color: ${({ theme }) => theme.color.backgroundGreenBold};
      border-color: ${({ theme }) => theme.color.backgroundGreenBold};
      svg path {
        fill: ${({ theme }) => theme.color.iconDefaultInverse};
      }
    }
  }

  ${({ isPressed, disabled, theme }) =>
    isPressed &&
    !disabled &&
    css`
      color: ${theme.color.textHover};
      ${IconWrap} {
        background-color: ${theme.color.backgroundGreenDefault};
        border-color: ${theme.color.backgroundGreenDefault};
        svg path {
          fill: ${theme.color.iconDefaultInverse};
        }
      }
    `}
`;

const Text = styled.span`
  display: block;
  transition: color 0.2s;
  background: none;
  padding: 0;
  color: inherit;
  cursor: pointer;

  &::first-letter {
    text-transform: capitalize;
  }
`;

export { ButtonElement, Text, IconWrap };
