import {
  isMonday,
  previousMonday,
  isSunday,
  previousSunday,
  addDays,
  eachDayOfInterval,
  subDays,
  subWeeks,
  addWeeks,
} from 'date-fns';
import { DAYS_PER_PAGE, startOfWeekIndex, SUNDAY_INDEX } from './Calendar.consts';

const getPageStartDate = (date: Date) => {
  if (startOfWeekIndex === SUNDAY_INDEX) {
    return isSunday(date) ? date : previousSunday(date);
  }

  return isMonday(date) ? date : previousMonday(date);
};

export const getDateList = (month: number, year: number): Date[] => {
  const firstDayOfMonth = new Date(year, month, 1);

  const start = getPageStartDate(firstDayOfMonth);
  const end = addDays(start, DAYS_PER_PAGE - 1);

  return eachDayOfInterval({ start, end });
};

export const getPreviousDay = (date: Date) => subDays(date, 1);

export const getNextDay = (date: Date) => addDays(date, 1);

export const getDayWeekAgo = (date: Date) => subWeeks(date, 1);

export const getDayWeekAfter = (date: Date) => addWeeks(date, 1);

export const isValidDate = (date: unknown): date is Date => date instanceof Date && !Number.isNaN(date.getTime());

export const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
