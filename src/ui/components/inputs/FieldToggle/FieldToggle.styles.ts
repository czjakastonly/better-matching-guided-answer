import styled, { css } from 'styled-components';
import { type FieldToggleSize } from './FieldToggle.types';

const Label = styled.label<{ $size?: FieldToggleSize }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  width: ${({ $size }) => ($size === 'small' ? '30' : '44')}px;
  height: ${({ $size }) => ($size === 'small' ? '16' : '24')}px;
  border-radius: ${({ $size }) => ($size === 'small' ? '8' : '12')}px;

  &:has(input:focus-visible) {
    outline: 2px solid ${({ theme }) => theme.color.borderFocus};
  }
`;

const Slider = styled.span<{ $size?: FieldToggleSize; $checked: boolean; $disabled?: boolean }>`
  position: relative;
  cursor: pointer;

  &:before,
  &:after {
    content: '';
    position: absolute;
    transform: translate(0, -50%);
    transition: all 0.3s ease;
  }

  &:before {
    left: 1px;
    width: ${({ $size }) => ($size === 'small' ? '28' : '42')}px;
    height: ${({ $size }) => ($size === 'small' ? '12' : '20')}px;
    background-color: ${({ theme }) => theme.color.iconSubtle};
    border-radius: 10px;
  }

  &:after {
    left: 0;
    width: ${({ $size }) => ($size === 'small' ? '16' : '24')}px;
    height: ${({ $size }) => ($size === 'small' ? '16' : '24')}px;
    background-color: ${({ theme }) => theme.color.iconDefaultInverse};
    border-radius: 50%;
    box-shadow: ${({ theme }) => theme.shadows.basic};
  }

  ${({ $checked, theme }) =>
    $checked &&
    css`
      &:before {
        background-color: ${theme.color.iconActive};
      }

      &:after {
        background-color: ${theme.color.backgroundDefault};
        transform: translate(83%, -50%);
      }
    `};
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: default;
    `}
`;

export default { Label, Slider };
