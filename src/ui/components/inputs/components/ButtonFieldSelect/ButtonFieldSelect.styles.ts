import styled, { css } from 'styled-components';
import { focusInputOutlineStyle, FieldStyles } from '../../_shared/Field.styles';

const ButtonElement = styled.button<{
  $isPlaceholder?: boolean;
  isOpen?: boolean;
}>`
  font-family: inherit;
  border: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none;
  background: none;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 4px;
  outline: 2px solid transparent;
  outline-offset: -1px;
  transition: outline-color 0.2s;
  padding: 0;
  cursor: pointer;
  overflow: hidden;

  &:focus {
    &:not(:active) {
      z-index: 1; /* to make outline cover additional action button */
      ${focusInputOutlineStyle}
    }
  }

  &:active {
    color: ${props => props.theme.color.textHover};

    & svg path {
      fill: ${({ theme }) => theme.color.iconHover};
    }
  }

  &:has(+ ${FieldStyles.ButtonElementWrap}) {
    border-radius: 3px 0 0 3px;
  }

  ${({ theme, $isPlaceholder }) =>
    $isPlaceholder &&
    css`
      color: ${theme.color.textPlaceholder};
    `}

  ${({ theme, disabled }) =>
    disabled &&
    css`
      color: ${theme.color.textPlaceholder};
      background-color: ${theme.color.backgroundDefaultHover};
      cursor: default;
      & svg path {
        fill: ${theme.color.iconSubtle};
      }
    `}
`;

const Text = styled.span`
  ${({ theme }) => theme.typography.uiElement};
  text-align: start;
  font-family: inherit;
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  padding: 10px 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  * + & {
    padding-left: 8px; // smaller padding when icon on the left
  }
`;

export default { ButtonElement, Text };
