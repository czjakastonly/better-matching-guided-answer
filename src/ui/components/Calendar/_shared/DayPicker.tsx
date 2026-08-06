import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { useDomId } from '@ui/utils/domId';
import { weekDayNameList, monthNameList, JANUARY_INDEX, DECEMBER_INDEX, today } from '../Calendar.consts';
import { CalendarStyles } from './styles';
import {
  getDateList,
  getNextDay,
  getPreviousDay,
  getDayWeekAfter,
  getDayWeekAgo,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from '../Calendar.helpers';
import { Header, type HeaderTranslations } from './Header';

const getDayIdFromDateStr = ({ dateStr, domId }: { dateStr: string; domId: string }) => {
  return `${domId}-${dateStr.replaceAll(/\s/g, '-')}`;
};

export interface DayPickerTranslations extends HeaderTranslations {
  todayLabel?: string;
}

export const DayPicker = ({
  activeMonth,
  activeYear,
  selectedDate,
  onDayClick,
  setActiveMonth,
  setActiveYear,
  onTitleClick,
  getIsDateDisabled,
  todayLabel = 'Today',
  calendarNavigationLabel,
  previousLabel,
  nextLabel,
}: {
  activeMonth: number;
  activeYear: number;
  selectedDate?: Date;
  onDayClick?: (date: Date) => void;
  setActiveMonth: (month: number) => void;
  setActiveYear: (year: number) => void;
  onTitleClick?: () => void;
  getIsDateDisabled: (date: Date) => boolean;
} & DayPickerTranslations) => {
  const domId = useDomId();
  const gridRef = useRef<HTMLDivElement>(null);

  const dayList = useMemo(
    () =>
      getDateList(activeMonth, activeYear).map(date => {
        const dateStr = date.toDateString();
        return {
          dateObj: date,
          dateNumber: date.getDate(),
          dateStr,
          isToday: dateStr === today.toDateString(),
          isCurrentMonth: date.getMonth() === activeMonth,
          isSelected: dateStr === selectedDate?.toDateString(),
          monthNumber: date.getMonth(),
          yearNumber: date.getFullYear(),
          isDisabled: getIsDateDisabled(date),
        };
      }),
    [activeMonth, activeYear, selectedDate, getIsDateDisabled]
  );

  const [focusableDay, setFocusableDay] = useState<string>();

  const onPrevClick = useCallback(() => {
    const newMonth = activeMonth === JANUARY_INDEX ? DECEMBER_INDEX : activeMonth - 1;
    const newYear = activeMonth === JANUARY_INDEX ? activeYear - 1 : activeYear;
    setActiveMonth(newMonth);
    setActiveYear(newYear);
  }, [activeMonth, activeYear, setActiveMonth, setActiveYear]);

  const onNextClick = useCallback(() => {
    const newMonth = activeMonth === DECEMBER_INDEX ? JANUARY_INDEX : activeMonth + 1;
    const newYear = activeMonth === DECEMBER_INDEX ? activeYear + 1 : activeYear;
    setActiveMonth(newMonth);
    setActiveYear(newYear);
  }, [activeMonth, activeYear, setActiveMonth, setActiveYear]);

  const onGridKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        return;
      }
      event.preventDefault();

      const currentDay = dayList.find(day => day.dateStr === focusableDay);

      if (!currentDay) {
        return;
      }

      let dayToFocus;

      if (event.key === 'ArrowLeft') {
        dayToFocus = getPreviousDay(currentDay.dateObj);
      }

      if (event.key === 'ArrowRight') {
        dayToFocus = getNextDay(currentDay.dateObj);
      }

      if (event.key === 'ArrowUp') {
        dayToFocus = getDayWeekAgo(currentDay.dateObj);
      }

      if (event.key === 'ArrowDown') {
        dayToFocus = getDayWeekAfter(currentDay.dateObj);
      }

      if (event.key === 'Home') {
        dayToFocus = getFirstDayOfMonth(currentDay.dateObj);
      }

      if (event.key === 'End') {
        dayToFocus = getLastDayOfMonth(currentDay.dateObj);
      }

      if (!dayToFocus || getIsDateDisabled(dayToFocus)) {
        return;
      }

      const monthOfDayToFocus = dayToFocus.getMonth();
      const yearOfDayToFocus = dayToFocus.getFullYear();

      setFocusableDay(dayToFocus.toDateString());
      requestAnimationFrame(() => {
        const buttonToFocus = gridRef.current?.querySelector('button[tabIndex="0"]') as HTMLButtonElement | null;
        buttonToFocus?.focus();
      });

      if (monthOfDayToFocus !== activeMonth) {
        setActiveMonth(monthOfDayToFocus);
      }

      if (yearOfDayToFocus !== activeYear) {
        setActiveYear(yearOfDayToFocus);
      }
    },
    [focusableDay, dayList, activeMonth, activeYear, setActiveMonth, setActiveYear, getIsDateDisabled]
  );

  useEffect(() => {
    if (dayList.some(day => day.dateStr === focusableDay && day.isCurrentMonth)) {
      return;
    }

    const selectedDay = dayList.find(day => day.isSelected && !day.isDisabled);
    const firstActiveDayOfCurrentMonth = dayList.find(day => day.isCurrentMonth && !day.isDisabled);

    if (selectedDay) {
      setFocusableDay(selectedDay.dateStr);
    } else if (firstActiveDayOfCurrentMonth) {
      setFocusableDay(firstActiveDayOfCurrentMonth.dateStr);
    }
  }, [dayList, focusableDay]);

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
        {monthNameList[activeMonth]} {activeYear}
      </Header>
      <CalendarStyles.DayPickerWrapper>
        <CalendarStyles.WeekDayWrapper role="row">
          {weekDayNameList.map(weekDay => (
            <CalendarStyles.WeekDay key={weekDay} role="columnheader" aria-label={weekDay}>
              {weekDay}
            </CalendarStyles.WeekDay>
          ))}
        </CalendarStyles.WeekDayWrapper>
        <CalendarStyles.DayGrid
          onKeyDown={onGridKeyDown}
          ref={gridRef}
          role="grid"
          aria-label={`${monthNameList[activeMonth]} ${activeYear}`}
          aria-activedescendant={focusableDay ? getDayIdFromDateStr({ dateStr: focusableDay, domId }) : undefined}
        >
          {dayList.map(day => (
            <CalendarStyles.DayButton
              id={getDayIdFromDateStr({ dateStr: day.dateStr, domId })}
              tabIndex={focusableDay === day.dateStr ? 0 : -1}
              key={day.dateStr}
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              onClick={onDayClick ? () => onDayClick(day.dateObj) : undefined}
              isSelected={day.isSelected}
              disabled={day.isDisabled}
              role="gridcell"
              aria-selected={day.isSelected}
              aria-label={`${day.dateStr}${day.isToday ? `, ${todayLabel}` : ''}`}
            >
              {day.dateNumber}
            </CalendarStyles.DayButton>
          ))}
        </CalendarStyles.DayGrid>
      </CalendarStyles.DayPickerWrapper>
    </div>
  );
};
