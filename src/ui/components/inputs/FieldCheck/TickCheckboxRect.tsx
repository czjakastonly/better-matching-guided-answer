import React from 'react';
import styled, { useTheme } from 'styled-components';
import CheckboxTickSVG from '@ui/atoms/icons/CheckboxTick-16.svg';
import CheckboxPartialSVG from '@ui/atoms/icons/CheckboxPartial-16.svg';
import type { TickProps } from './FieldCheck.types';

const IconTick = styled(CheckboxTickSVG)<{ $color: string }>`
  position: absolute;
  width: 16px;
  height: 16px;
  & path {
    stroke: ${({ $color }) => $color};
  }
`;

const IconPartial = styled(CheckboxPartialSVG)<{ $color: string }>`
  position: absolute;
  width: 16px;
  height: 16px;
  & path {
    stroke: ${({ $color }) => $color};
  }
`;

const Rect = styled.div<{ $borderColor?: string; $backgroundColor?: string; $checked?: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  transition: border-color 0.2s, background-color 0.2s;
  margin-top: 4px;
  margin-left: 2px;
  border-color: ${({ $borderColor }) => $borderColor};
  background-color: ${({ $backgroundColor }) => $backgroundColor};

  ${IconTick} {
    visibility: ${({ $checked }) => ($checked ? 'visible' : 'hidden')};
  }
`;

const getBorderColor = (
  theme: ReturnType<typeof useTheme>,
  {
    disabled,
    checked,
    indeterminate,
    statusBorderColor,
  }: Pick<TickProps, 'disabled' | 'checked' | 'indeterminate' | 'statusBorderColor'>
): string => {
  if (disabled) {
    return theme.color.borderSubtle;
  }

  if (checked || indeterminate) {
    return theme.color.borderPrimary;
  }

  if (statusBorderColor) {
    return statusBorderColor;
  }

  return theme.color.borderDefault;
};

const getBackgroundColor = (
  theme: ReturnType<typeof useTheme>,
  { disabled, checked, indeterminate }: Pick<TickProps, 'disabled' | 'checked' | 'indeterminate'>
): string => {
  if (checked) {
    return disabled ? theme.color.backgroundDefaultPressed : theme.color.backgroundPrimary;
  }

  if (indeterminate) {
    return disabled ? theme.color.backgroundDefaultPressed : theme.color.backgroundPrimary;
  }

  return disabled ? theme.color.backgroundGraySubtlest : theme.color.backgroundDefault;
};

export const TickCheckboxRect = ({
  disabled,
  checked,
  statusBorderColor,
  indeterminate,
  ...restDivAttributes
}: TickProps) => {
  const theme = useTheme();

  /* Resolve border color */
  const borderColor = getBorderColor(theme, { disabled, checked, indeterminate, statusBorderColor });

  /* Resolve background color */
  const backgroundColor = getBackgroundColor(theme, { disabled, checked, indeterminate });

  /* Resolve check color */
  const checkColor = disabled ? theme.color.backgroundGraySubtle : theme.color.backgroundDefault;

  return (
    <Rect {...restDivAttributes} $borderColor={borderColor} $backgroundColor={backgroundColor} $checked={!!checked}>
      {indeterminate ? <IconPartial $color={checkColor} /> : <IconTick $color={checkColor} />}
    </Rect>
  );
};
