import React, { useCallback, useRef, useState } from 'react';
import { useDomId } from '@ui/utils/domId';
import { CalendarStyles } from './styles';
import {
  monthNameList,
  JANUARY_INDEX,
  DECEMBER_INDEX,
  MONTHS_PER_COLUMN,
  MONTHS_IN_YEAR,
  today,
} from '../Calendar.consts';
import { Header, type HeaderTranslations } from './Header';

export interface MonthPickerTranslations extends HeaderTranslations {
  currentMonthLabel?: string;
  monthsInYearLabel?: string;
}

export const MonthPicker = ({
  onMonthClick,
  selectedDate,
  activeMonth,
  setActiveYear,
  activeYear,
  onTitleClick,
  currentMonthLabel = 'Current month',
  monthsInYearLabel = 'Months in',
  calendarNavigationLabel,
  previousLabel,
  nextLabel,
}: {
  onMonthClick?: (index: number) => void;
  selectedDate?: Date;
  activeMonth: number;
  setActiveYear: (year: number) => void;
  activeYear: number;
  onTitleClick?: () => void;
} & MonthPickerTranslations) => {
  const domId = useDomId();
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusableMonth, setFocusableMonth] = useState<number>(selectedDate?.getMonth() || today.getMonth());
  const onPrevClick = useCallback(() => setActiveYear(activeYear - 1), [activeYear, setActiveYear]);

  const onNextClick = useCallback(() => setActiveYear(activeYear + 1), [activeYear, setActiveYear]);

  const onGridKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        return;
      }
      event.preventDefault();

      let monthToFocus;

      if (event.key === 'ArrowLeft') {
        monthToFocus = focusableMonth === JANUARY_INDEX ? DECEMBER_INDEX : focusableMonth - 1;
      }

      if (event.key === 'ArrowRight') {
        monthToFocus = focusableMonth === DECEMBER_INDEX ? JANUARY_INDEX : focusableMonth + 1;
      }

      if (event.key === 'ArrowUp') {
        monthToFocus = focusableMonth - MONTHS_PER_COLUMN;
        monthToFocus = monthToFocus < JANUARY_INDEX ? monthToFocus + MONTHS_IN_YEAR : monthToFocus;
      }

      if (event.key === 'ArrowDown') {
        monthToFocus = focusableMonth + MONTHS_PER_COLUMN;
        monthToFocus = monthToFocus > DECEMBER_INDEX ? monthToFocus - MONTHS_IN_YEAR : monthToFocus;
      }

      if (event.key === 'Home') {
        monthToFocus = JANUARY_INDEX;
      }

      if (event.key === 'End') {
        monthToFocus = DECEMBER_INDEX;
      }

      if (monthToFocus === undefined) {
        return;
      }

      setFocusableMonth(monthToFocus);
      requestAnimationFrame(() => {
        const buttonToFocus = gridRef.current?.querySelector('button[tabIndex="0"]') as HTMLButtonElement | null;
        buttonToFocus?.focus();
      });
    },
    [focusableMonth]
  );

  return (
    <div role="application" id={domId}>
      <Header
        onPrevClick={onPrevClick}
        onNextClick={onNextClick}
        onTextClick={onTitleClick}
        calendarNavigationLabel={calendarNavigationLabel}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
      >
        {activeYear}
      </Header>
      <CalendarStyles.MonthGrid
        onKeyDown={onGridKeyDown}
        ref={gridRef}
        role="grid"
        aria-label={`${monthsInYearLabel} ${activeYear}`}
        aria-activedescendant={`${domId}-${focusableMonth + 1}-${activeYear}`}
      >
        {monthNameList.map((month, index) => (
          <CalendarStyles.MonthButton
            key={month}
            id={`${domId}-${index + 1}-${activeYear}`}
            tabIndex={index === focusableMonth ? 0 : -1}
            onClick={onMonthClick ? () => onMonthClick(index) : undefined}
            isCurrentMonth={index === today.getMonth()}
            isSelected={index === activeMonth}
            role="gridcell"
            aria-selected={index === activeMonth}
            aria-label={`${month} ${activeYear}${index === today.getMonth() ? `, ${currentMonthLabel}` : ''}`}
          >
            {month}
          </CalendarStyles.MonthButton>
        ))}
      </CalendarStyles.MonthGrid>
    </div>
  );
};
