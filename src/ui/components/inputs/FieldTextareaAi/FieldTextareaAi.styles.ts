import styled, { css } from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { focusButtonOutlineStyle } from '@ui/components/buttons/_shared/styles';
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
  height: auto;
  align-items: flex-end;
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
      & > textarea {
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

const ActionButton = styled.button<{ isPressed?: boolean }>`
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.backgroundPrimary};
  color: ${({ theme }) => theme.color.textDefaultInverse};
  border-color: ${({ theme }) => theme.color.backgroundPrimary};
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  padding: 7px;
  margin: 2px;
  cursor: pointer;
  outline: 2px solid transparent;
  outline-offset: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s, color 0.2s, background-color 0.2s, border-color 0.2s, outline-color 0.2s;

  &:focus-visible {
    ${focusButtonOutlineStyle}
  }

  svg path {
    fill: ${({ theme }) => theme.color.iconDefaultInverse};
  }

  &:hover {
    background-color: ${({ theme }) => theme.color.backgroundPrimaryHover};
    border-color: ${({ theme }) => theme.color.backgroundPrimaryHover};
  }

  &:active {
    background-color: ${({ theme }) => theme.color.backgroundPrimaryPressed};
    border-color: ${({ theme }) => theme.color.backgroundPrimaryPressed};
    color: ${({ theme }) => theme.color.backgroundPinkSubtle};
    & svg path {
      fill: ${({ theme }) => theme.color.backgroundPinkSubtle};
    }
  }

  ${({ disabled, theme }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.4;
      color: ${theme.color.textDefaultInverse};

      & svg path {
        fill: ${theme.color.textDefaultInverse};
      }
    `}

  ${({ disabled, isPressed, theme }) =>
    !disabled &&
    isPressed &&
    css`
      background-color: ${theme.color.backgroundPrimaryHover};
      border-color: ${theme.color.backgroundPrimaryHover};
    `}
`;

export const FieldTextareaAiStyles = { FieldWrap, TextareaAutosizeElement, ActionButton };
