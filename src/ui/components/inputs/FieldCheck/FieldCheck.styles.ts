import styled, { css } from 'styled-components';

const TICK_ICON_CLASS = 'tick-icon';

const InputElement = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const TooltipWrap = styled.span`
  line-height: 16px;
  margin-left: 4px;
`;

const Text = styled.span`
  ${({ theme }) => theme.typography.uiElement}
  margin-left: 8px;
  user-select: none;
`;

const RequiredLabelSuffix = styled.span.attrs({ 'aria-hidden': true })`
  color: ${({ theme }) => theme.color.iconPink};
  margin-left: 2px;
`;

const FieldCheckWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelWrap = styled.div`
  display: flex;
  position: relative;
  width: fit-content;
  align-items: center;
  border-radius: 4px; /* for focus outline to look like in text inputs */
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color 0.2s;

  &:has(input:focus-visible) {
    outline: 2px solid ${({ theme }) => theme.color.borderFocus};
  }
`;

const LabelElement = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: start;
  cursor: pointer;
  word-break: break-word;
  border-radius: 2px;

  ${({ $disabled, theme }) =>
    $disabled &&
    css`
      pointer-events: none;
      ${Text} {
        color: ${theme.color.textPlaceholder};
      }
    `}

  &:hover .${TICK_ICON_CLASS} {
    border-color: ${({ theme }) => theme.color.borderPrimary};
  }
`;

const InputMessageWrap = styled.div<{ $textColor?: string | false }>`
  ${({ theme }) => theme.typography.uiElementSmallStrong};
  width: 100%;
  color: ${({ theme, $textColor }) => $textColor || theme.color.textSubtle};
  margin-top: 4px;
  margin-left: 24px;
  display: flex;
  align-items: flex-start;
`;

const InputMessageIconWrap = styled.div<{ $color: string | undefined }>`
  display: flex;
  align-items: center;
  height: 12px;
  width: 12px;
  margin-top: 2px;
  margin-right: 4px;
  ${({ $color }) =>
    $color &&
    css`
      & svg path {
        fill: ${$color};
      }
    `}
`;

export default {
  LabelElement,
  Text,
  FieldCheckWrap,
  LabelWrap,
  InputElement,
  RequiredLabelSuffix,
  TooltipWrap,
  TICK_ICON_CLASS,
  InputMessageWrap,
  InputMessageIconWrap,
};
