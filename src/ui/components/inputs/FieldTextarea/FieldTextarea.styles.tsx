import styled, { css } from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { focusInputOutlineStyle } from '../_shared/Field.styles';

const FieldWrap = styled.div<{
  $borderColor?: string;
  $disabled?: boolean;
}>`
  display: flex;
  width: 100%;
  border: 1px solid ${({ theme, $borderColor }) => $borderColor || theme.color.borderDefault};
  background: ${({ theme }) => theme.color.backgroundDefault};
  border-radius: 4px;
  background: ${({ theme }) => theme.color.backgroundDefault};
  height: auto;
  align-items: flex-start;
  outline: 2px solid transparent;
  outline-offset: -1px;
  transition: outline-color 0.2s;

  &:has(:focus-visible) {
    outline-offset: -1px;
    ${focusInputOutlineStyle}
  }

  ${({ theme, $disabled }) =>
    $disabled &&
    css`
      pointer-events: none;
      background: ${theme.color.backgroundDefaultHover};
      & > input {
        color: ${theme.color.textPlaceholder};
      }
      svg path {
        fill: ${theme.color.iconSubtle};
      }
    `}
`;

const TextareaAutosizeElement = styled(TextareaAutosize)`
  ${({ theme }) => theme.typography.uiElement};
  font-family: inherit;
  color: ${({ theme }) => theme.color.textDark};
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  appearance: none;
  resize: none;
  padding: 8px 12px;

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;

export const FieldTextAreaStyles = { FieldWrap, TextareaAutosizeElement };
