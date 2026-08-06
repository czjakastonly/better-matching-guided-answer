import styled, { css } from 'styled-components';
import { focusInputOutlineStyle } from '../../_shared/Field.styles';

const ButtonElement = styled.button<{ isPressed?: boolean }>`
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  text-decoration: none;
  border: none;
  border-radius: 0 3px 3px 0;
  padding: 0;
  margin: 0;
  height: 100%;

  display: flex;
  align-items: center;
  background: none;
  outline: 2px solid transparent;
  outline-offset: -1px;
  transition: outline-color 0.2s;

  &:active {
    background-color: ${({ theme }) => theme.color.backgroundDefaultTransparentPressed};
    color: ${props => props.theme.color.textHover};

    & svg path {
      fill: ${({ theme }) => theme.color.iconHover};
    }
  }

  &:focus-visible,
  &:has([aria-expanded='true']) {
    ${focusInputOutlineStyle};
  }

  ${({ disabled, isPressed, theme }) =>
    !disabled &&
    isPressed &&
    css`
      background-color: ${theme.color.backgroundDefaultTransparentHover};
      color: ${theme.color.textHover};

      & svg path {
        fill: ${theme.color.iconHover};
      }
    `}

  ${({ theme, disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      background: ${theme.color.backgroundDefaultActive};

      & svg path {
        fill: ${theme.color.iconSubtle};
      }
    `}
`;

export default {
  ButtonElement,
};
