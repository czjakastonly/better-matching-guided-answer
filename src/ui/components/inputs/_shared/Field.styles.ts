import styled, { css } from 'styled-components';

export const focusInputOutlineStyle = css`
  outline: 2px solid ${({ theme }) => theme.color.borderFocus};
`;

const IconWrap = styled.span<{ $color?: string }>`
  ${({ theme }) => theme.typography.uiElement};
  display: flex;
  align-items: center;
  height: 16px;
  width: fit-content; // eventually remove it
  margin: 12px;
  color: ${({ theme }) => theme.color.textSubtle};
  ${({ $color }) =>
    $color &&
    css`
      & svg path {
        fill: ${$color};
      }
    `}
`;

const IconLeftWrap = styled(IconWrap).attrs({
  tabIndex: -1, // fix if input's focus is blinking on mousedown (2024-01 not blinking)
})`
  margin-right: 0;
`;

const IconRightWrap = styled(IconWrap).attrs({
  tabIndex: -1, // fix if input's focus is blinking on mousedown (2024-01 not blinking)
})`
  margin-left: 0;
  outline: none;
`;

const IconUnitsWrap = styled(IconWrap).attrs({
  tabIndex: -1, // fix if input's focus is blinking on mousedown (2024-01 not blinking)
})`
  margin-left: 0;
  outline: none;
  & svg path {
    fill: ${props => props.theme.color.iconDefault};
  }
`;

const ButtonElementWrap = styled.div`
  margin: 0;
  padding: 0;
  border-width: 0 0 0 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.color.borderDefault};
`;

const InputElementWrap = styled.div<{
  $disabled?: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 3px;
  outline: 2px solid transparent;
  outline-offset: -1px;
  transition: outline-color 0.2s;

  &:focus-within /* if has(:focus-visible) was used then it will blink on icon click */ {
    z-index: 1; /* to make outline cover additional action button */
    ${focusInputOutlineStyle}
  }

  &:has(+ ${ButtonElementWrap}) {
    border-radius: 3px 0 0 3px;
  }

  ${({ theme, $disabled }) =>
    $disabled &&
    css`
      pointer-events: none;
      background: ${theme.color.backgroundDefaultHover};

      & input {
        color: ${theme.color.textPlaceholder};
      }
      & ${IconWrap} svg path {
        fill: ${theme.color.iconSubtle};
      }
    `}
`;

const FieldWrap = styled.div<{ $borderColor?: string }>`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  border: 1px solid ${({ theme, $borderColor }) => $borderColor || theme.color.borderDefault};
  border-radius: 4px;
  background: ${({ theme }) => theme.color.backgroundDefault};

  ${({ theme, $borderColor }) => css`
    border-color: ${$borderColor || theme.color.borderDefault};
    ${ButtonElementWrap} {
      border-color: ${$borderColor || theme.color.borderDefault};
    }
  `}
`;

const InputElement = styled.input`
  ${({ theme }) => theme.typography.uiElement};
  font-family: inherit;
  color: ${({ theme }) => theme.color.textDark};
  width: 100%;
  min-width: 48px;
  border: 0;
  outline: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  appearance: none;
  padding: 10px 12px;

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  ${IconLeftWrap}+& {
    padding-left: 8px;
  }
`;

export const FieldStyles = {
  FieldWrap,
  InputElementWrap,
  ButtonElementWrap,
  IconWrap,
  IconLeftWrap,
  InputElement,
  IconRightWrap,
  IconUnitsWrap,
};
