import React, { useState, useCallback, useEffect } from 'react';
import type { CalendarProps, CalendarScreen } from './Calendar.types';
import { DayPicker } from './_shared/DayPicker';
import { MonthPicker } from './_shared/MonthPicker';
import { YearPicker } from './_shared/YearPicker';
import { CALENDAR_SCREEN_TYPE, today } from './Calendar.consts';
import { CalendarStyles } from './_shared/styles';
import { isValidDate } from './Calendar.helpers';

export const Calendar = ({
  value,
  onSelect,
  isFutureDisabled,
  isPastDisabled,
  translations,
  ...restDivAttributes
}: CalendarProps) => {
  const [currentScreen, setCurrentScreen] = useState<CalendarScreen>(CALENDAR_SCREEN_TYPE.DAY);
  const [activeMonth, setActiveMonth] = useState<number>(() =>
    isValidDate(value) ? value.getMonth() : today.getMonth()
  );
  const [activeYear, setActiveYear] = useState<number>(() =>
    isValidDate(value) ? value.getFullYear() : today.getFullYear()
  );

  const onDayClick = useCallback(
    (date: Date) => {
      if (typeof onSelect === 'function') {
        onSelect(date);
      }

      if (date) {
        setActiveMonth(date.getMonth());
        setActiveYear(date.getFullYear());
      }
    },
    [onSelect]
  );

  const onMonthClick = useCallback((monthIndex: number) => {
    setActiveMonth(monthIndex);
    setCurrentScreen(CALENDAR_SCREEN_TYPE.DAY);
  }, []);

  const onYearClick = useCallback((year: number) => {
    setActiveYear(year);
    setCurrentScreen(CALENDAR_SCREEN_TYPE.MONTH);
  }, []);

  const getIsDateDisabled = useCallback(
    (date: Date) => (isPastDisabled && date < today) || (isFutureDisabled && date > today) || false,
    [isFutureDisabled, isPastDisabled]
  );

  useEffect(() => {
    if (isValidDate(value)) {
      setActiveMonth(value.getMonth());
      setActiveYear(value.getFullYear());
    }
  }, [value]);

  if (!currentScreen) {
    return null;
  }

  return (
    <CalendarStyles.CalendarWrapper {...restDivAttributes}>
      {currentScreen === CALENDAR_SCREEN_TYPE.DAY && (
        <DayPicker
          onDayClick={onDayClick}
          selectedDate={isValidDate(value) ? value : undefined}
          activeYear={activeYear}
          setActiveYear={setActiveYear}
          activeMonth={activeMonth}
          setActiveMonth={setActiveMonth}
          onTitleClick={() => setCurrentScreen(CALENDAR_SCREEN_TYPE.MONTH)}
          getIsDateDisabled={getIsDateDisabled}
          todayLabel={translations?.todayLabel}
          calendarNavigationLabel={translations?.calendarNavigationLabel}
          previousLabel={translations?.previousLabel}
          nextLabel={translations?.nextLabel}
        />
      )}

      {currentScreen === CALENDAR_SCREEN_TYPE.MONTH && (
        <MonthPicker
          onMonthClick={onMonthClick}
          selectedDate={isValidDate(value) ? value : undefined}
          activeYear={activeYear}
          activeMonth={activeMonth}
          setActiveYear={setActiveYear}
          onTitleClick={() => setCurrentScreen(CALENDAR_SCREEN_TYPE.YEAR)}
          calendarNavigationLabel={translations?.calendarNavigationLabel}
          previousLabel={translations?.previousLabel}
          nextLabel={translations?.nextLabel}
          currentMonthLabel={translations?.currentMonthLabel}
          monthsInYearLabel={translations?.monthsInYearLabel}
        />
      )}

      {currentScreen === CALENDAR_SCREEN_TYPE.YEAR && (
        <YearPicker
          onYearClick={onYearClick}
          selectedDate={isValidDate(value) ? value : undefined}
          activeYear={activeYear}
          calendarNavigationLabel={translations?.calendarNavigationLabel}
          previousLabel={translations?.previousLabel}
          nextLabel={translations?.nextLabel}
          currentYearLabel={translations?.currentYearLabel}
        />
      )}
    </CalendarStyles.CalendarWrapper>
  );
};
