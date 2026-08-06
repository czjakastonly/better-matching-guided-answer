import styled, { css } from 'styled-components';

const InputLabel = styled.span`
  ${({ theme }) => theme.typography.uiElementSmallStrong};
  color: ${({ theme }) => theme.color.textSubtle};
  margin-bottom: 4px;
  display: block;
  cursor: default;
  transition: color 0.2s;
`;

const InputContainer = styled.div<{ withMessageBelow?: boolean }>`
  min-width: 0;
  width: 100%;
  position: relative; // needed only in InputMessageWrap for ellipsis. Should not be needed by any InputField

  &:has([aria-expanded='true']), // for dropdown buttons
  &:focus-within {
    ${InputLabel} {
      color: ${({ theme }) => theme.color.textDark};
    }
  }

  &:has(input:disabled) {
    // future, todo - we will have contenteditable divs AND we don't want it to work with ButtonAdditionalAction disabled, and for selects with disabled options
    ${InputLabel} {
      color: ${props => props.theme.color.textPlaceholder};
    }
  }
`;

const InputRequiredLabelSuffix = styled.span.attrs({ ariaHidden: true })`
  color: ${({ theme }) => theme.color.iconPink};
  margin-left: 2px;
`;

const InputMessageWrap = styled.div<{ $textColor?: string | false }>`
  ${({ theme }) => theme.typography.uiElementSmall};
  width: 100%;
  color: ${({ theme, $textColor }) => $textColor || theme.color.textSubtle};
  margin-top: 4px;
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

export default { InputContainer, InputLabel, InputRequiredLabelSuffix, InputMessageWrap, InputMessageIconWrap };
