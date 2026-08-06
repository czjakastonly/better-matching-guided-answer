import styled, { css } from 'styled-components';

/* Common */

const baseButtonStyles = css`
  ${({ theme }) => theme.typography.uiElement}
  color: ${({ theme }) => theme.color.textDefault};
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
`;

const hoverStateStyles = css`
  :hover {
    background-color: ${({ theme }) => theme.color.backgroundDefaultHover};
    color: ${({ theme }) => theme.color.textDark};
  }
`;

const selectedStateStyles = ({ isSelected }: { isSelected?: boolean }) =>
  isSelected &&
  css`
    background-color: ${({ theme }) => theme.color.backgroundGrayBoldest};
    color: ${({ theme }) => theme.color.textDefaultInverse};
    border: none;

    :hover {
      background-color: ${({ theme }) => theme.color.backgroundGrayBoldest};
      color: ${({ theme }) => theme.color.textDefaultInverse};
      border: none;
    }
  `;

const currentItemStyles = ({ isCurrent }: { isCurrent?: boolean }) =>
  isCurrent &&
  css`
    border: 1px solid ${({ theme }) => theme.color.borderSubtle};
    :hover {
      border: none;
    }
  `;

const CalendarWrapper = styled.div`
  width: 312px;
  height: 392px;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.basic};
`;

/* Day picker */

const DayPickerWrapper = styled.div`
  width: 280px;
  padding: 24px 16px 16px 16px;
  gap: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 2px;
  row-gap: 2px;
  outline: none;
`;

const WeekDayWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 2px;
`;

const WeekDay = styled.div`
  ${({ theme }) => theme.typography.textSmall}
  color: ${({ theme }) => theme.color.textSubtle};
  text-align: center;
  text-transform: capitalize;
`;

const DayButton = styled.button<{
  isSelected?: boolean;
  isToday?: boolean;
  isCurrentMonth?: boolean;
  disabled?: boolean;
}>`
  ${baseButtonStyles}
  color: ${({ theme }) => theme.color.textSubtle};
  height: 40px;

  ${({ isCurrentMonth }) =>
    isCurrentMonth &&
    css`
      color: ${({ theme }) => theme.color.textDark};
    `}
  ${({ isToday }) => currentItemStyles({ isCurrent: isToday })}
  ${hoverStateStyles}
  ${({ isSelected }) => selectedStateStyles({ isSelected })}
  ${({ disabled }) =>
    disabled &&
    css`
      color: ${({ theme }) => theme.color.textSubtle};
      pointer-events: none;
      cursor: default;
    `}
`;

/* Month picker */

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 24px 16px 16px 16px;
  column-gap: 2px;
  row-gap: 2px;
  outline: none;
`;

const MonthButton = styled.button<{ isSelected?: boolean; isCurrentMonth?: boolean }>`
  ${baseButtonStyles}
  ${({ isCurrentMonth }) => currentItemStyles({ isCurrent: isCurrentMonth })}
  ${hoverStateStyles}
  ${({ isSelected }) => selectedStateStyles({ isSelected })}
  height: 40px;
  text-transform: capitalize;
`;

/* Year picker */

const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 24px 16px 16px 16px;
  column-gap: 2px;
  row-gap: 2px;
  outline: none;
`;

const YearButton = styled.button<{ isSelected?: boolean; isCurrentYear?: boolean }>`
  ${baseButtonStyles}
  height: 40px;
  text-transform: capitalize;
  ${({ isCurrentYear }) => currentItemStyles({ isCurrent: isCurrentYear })}
  ${hoverStateStyles}
  ${({ isSelected }) => selectedStateStyles({ isSelected })}
`;

/* Header */
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 100%;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderDefault};
`;

const HeaderText = styled.div`
  ${({ theme }) => theme.typography.uiElementStrong}
  color: ${({ theme }) => theme.color.textDark};
  padding: 8px 0;
`;

export const CalendarStyles = {
  CalendarWrapper,
  DayPickerWrapper,
  DayGrid,
  WeekDayWrapper,
  WeekDay,
  DayButton,
  MonthGrid,
  MonthButton,
  YearGrid,
  YearButton,
  HeaderWrapper,
  HeaderText,
};
