import styled, { css } from 'styled-components';
import { type LinkSize } from '@ui/components/links/LinkPrimary/LinkPrimary.types';

const IconWrap = styled.span`
  display: flex;
  align-items: center;
  width: 16px;
  height: 16px;
`;

const TextWrap = styled.span`
  &::first-letter {
    text-transform: capitalize;
  }
`;

const LinkPrimary = styled.a<{ isPressed?: boolean; $size: LinkSize; disabled?: boolean }>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.theme.typography.uiElement};
  color: ${({ theme }) => theme.color.textDefaultInverse};
  font-style: normal;
  font-family: inherit;
  text-wrap: nowrap;
  text-decoration: none;

  border-style: solid;
  border-radius: 18px;
  border-width: 1px;
  outline: 0;
  border-color: ${({ theme }) => theme.color.borderPrimary};

  width: fit-content;
  height: 36px;
  padding: 7px 15px;
  background-color: ${({ theme }) => theme.color.backgroundPrimary};

  cursor: pointer;
  transition: opacity 0.2s, color 0.2s, background-color 0.2s, border-color 0.2s;

  ${TextWrap} {
    padding: 0 8px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.borderFocus};
    outline-offset: 2px;
  }

  & svg path {
    fill: ${({ theme }) => theme.color.iconDefaultInverse};
  }

  &:hover,
  &:active {
    background-color: ${({ isPressed, theme }) =>
      isPressed ? theme.color.backgroundPrimaryPressed : theme.color.backgroundPrimaryHover};
    border-color: ${({ isPressed, theme }) =>
      isPressed ? theme.color.backgroundPrimaryPressed : theme.color.backgroundPrimaryHover};
  }

  ${({ disabled, theme }) =>
    disabled &&
    css`
      opacity: 0.35;
      pointer-events: none;
      color: ${theme.color.textDefaultInverse};

      & svg path {
        fill: ${theme.color.iconDefaultInverse};
      }
    `}

  ${({ disabled, isPressed, theme }) =>
    !disabled &&
    isPressed &&
    css`
      background-color: ${theme.color.backgroundPrimaryPressed}; // TODO @design-system
      border-color: ${theme.color.backgroundPrimaryPressed}; // TODO @design-system
    `}

  ${({ $size }) =>
    $size === 'small' &&
    css`
      height: 24px;
      padding: 3px 7px;
      ${props => props.theme.typography.uiElementSmallStrong};
    `}
`;

export const LinkStyles = {
  LinkPrimary,
  TextWrap,
  IconWrap,
};
