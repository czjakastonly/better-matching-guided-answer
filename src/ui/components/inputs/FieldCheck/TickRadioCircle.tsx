import React from 'react';
import styled, { useTheme } from 'styled-components';
import type { TickProps } from './FieldCheck.types';

const IconTick = styled.span<{ $color: string }>`
  content: '';
  height: 6px;
  width: 6px;
  background-color: ${({ $color }) => $color};
  border-radius: 50%;
  display: block;
`;

const Circle = styled.div<{ $borderColor?: string; $backgroundColor?: string; $checked?: boolean }>`
  box-sizing: content-box;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 0;
  padding: 3px;
  margin: 3px 2px 3px 2px;
  border: 1.5px solid ${({ $borderColor }) => $borderColor};
  border-radius: 50%;
  background-color: ${props => props.theme.color.backgroundDefault};
  transition: border 0.2s, background-color 0.2s;

  ${IconTick} {
    visibility: ${({ $checked }) => ($checked ? 'visible' : 'hidden')};
  }
`;

export const TickRadioCircle = ({ disabled, checked, statusBorderColor, ...restDivAttributes }: TickProps) => {
  const theme = useTheme();

  /* Resolve border color */
  let borderColor = '';
  if (disabled) {
    borderColor = theme.color.borderSubtle;
  } else if (checked) {
    borderColor = theme.color.borderPrimary;
  } else if (statusBorderColor) {
    borderColor = statusBorderColor;
  } else {
    borderColor = theme.color.borderDefault;
  }

  /* Resolve check color */
  const checkColor = disabled ? theme.color.backgroundDefaultPressed : theme.color.backgroundPrimary;

  return (
    <Circle {...restDivAttributes} $borderColor={borderColor} $checked={!!checked}>
      <IconTick $color={checkColor} />
    </Circle>
  );
};
