import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDomId } from '@ui/utils/domId';
import { CalendarStyles } from './styles';
import { Header, type HeaderTranslations } from './Header';
import { YEARS_PER_PAGE, MIDDLE_YEAR_INDEX, YEARS_PER_COLUMN, today } from '../Calendar.consts';

const getYearList = (activeYear: number): number[] => {
  const currentYear = today.getFullYear();

  // If current year is within year list, we want it to be displayed second last on the list
  const isCurrentYearWithinRange = currentYear - 18 <= activeYear && activeYear <= currentYear + 1;

  if (isCurrentYearWithinRange) {
    return Array.from({ length: YEARS_PER_PAGE }, (_, i) => currentYear - 18 + i);
  }

  // Otherwise, we want the active year to be on the 10th place
  return Array.from({ length: YEARS_PER_PAGE }, (_, i) => activeYear - MIDDLE_YEAR_INDEX + i);
};

export interface YearPickerTranslations extends HeaderTranslations {
  currentYearLabel?: string;
}

export const YearPicker = ({
  onYearClick,
  activeYear,
  selectedDate,
  currentYearLabel = 'Current year',
  calendarNavigationLabel,
  previousLabel,
  nextLabel,
}: {
  onYearClick?: (year: number) => void;
  activeYear: number;
  selectedDate?: Date;
} & YearPickerTranslations) => {
  const domId = useDomId();
  const [yearRange, setYearRange] = useState<number[]>(() => getYearList(activeYear));

  const gridRef = useRef<HTMLDivElement>(null);
  const [focusableYear, setFocusableYear] = useState<number>(selectedDate?.getFullYear() || today.getFullYear());

  useEffect(() => {
    if (!focusableYear || !yearRange.includes(focusableYear)) {
      setFocusableYear(yearRange[0]);
    }
  }, [focusableYear, yearRange]);

  const onPrevClick = useCallback(() => setYearRange(curr => curr.map(year => year - YEARS_PER_PAGE)), []);

  const onNextClick = useCallback(() => setYearRange(curr => curr.map(year => year + YEARS_PER_PAGE)), []);

  const onGridKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        return;
      }
      event.preventDefault();

      let yearToFocus;

      if (event.key === 'ArrowLeft') {
        yearToFocus = focusableYear - 1;
      }

      if (event.key === 'ArrowRight') {
        yearToFocus = focusableYear + 1;
      }

      if (event.key === 'ArrowUp') {
        yearToFocus = focusableYear - YEARS_PER_COLUMN;
      }

      if (event.key === 'ArrowDown') {
        yearToFocus = focusableYear + YEARS_PER_COLUMN;
      }

      if (event.key === 'Home') {
        yearToFocus = yearRange[0];
      }

      if (event.key === 'End') {
        yearToFocus = yearRange[yearRange.length - 1];
      }

      if (yearToFocus === undefined) {
        return;
      }

      setFocusableYear(yearToFocus);
      requestAnimationFrame(() => {
        const buttonToFocus = gridRef.current?.querySelector('button[tabIndex="0"]') as HTMLButtonElement | null;
        buttonToFocus?.focus();
      });

      if (yearToFocus < yearRange[0]) {
        onPrevClick();
      }

      if (yearToFocus > yearRange[yearRange.length - 1]) {
        onNextClick();
      }
    },
    [focusableYear, yearRange, onPrevClick, onNextClick]
  );

  return (
    <div role="application" id={domId}>
      <Header
        onPrevClick={onPrevClick}
        onNextClick={onNextClick}
        calendarNavigationLabel={calendarNavigationLabel}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
      >
        {yearRange[0]}
        {' - '}
        {yearRange[yearRange.length - 1]}
      </Header>
      <CalendarStyles.YearGrid
        onKeyDown={onGridKeyDown}
        ref={gridRef}
        role="grid"
        aria-label={`${yearRange[0]} - ${yearRange[yearRange.length - 1]}`}
        aria-activedescendant={`${domId}-year-${focusableYear}`}
      >
        {yearRange.map(year => (
          <CalendarStyles.YearButton
            key={year}
            id={`${domId}-year-${year}`}
            tabIndex={year === focusableYear ? 0 : -1}
            onClick={onYearClick ? () => onYearClick(year) : undefined}
            isCurrentYear={year === today.getFullYear()}
            isSelected={year === activeYear}
            role="gridcell"
            aria-selected={year === activeYear}
            aria-label={`${year}${year === today.getFullYear() ? `, ${currentYearLabel}` : ''}`}
          >
            {year}
          </CalendarStyles.YearButton>
        ))}
      </CalendarStyles.YearGrid>
    </div>
  );
};
