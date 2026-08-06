import * as locales from 'date-fns/locale';

export const CALENDAR_SCREEN_TYPE = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
} as const;

/* Day */
export const DAYS_PER_PAGE = 42; // 6 weeks
export const DAYS_IN_WEEK = 7;
export const MONDAY_INDEX = 1;
export const SUNDAY_INDEX = 0;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const startOfWeekByLanguageCode = Object.fromEntries(
  Object.values(locales).map(locale => [locale.code, locale.options?.weekStartsOn])
);

// Only Monday and Sunday are supported for now
export const startOfWeekIndex = ((): typeof MONDAY_INDEX | typeof SUNDAY_INDEX => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const index =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    startOfWeekByLanguageCode[navigator.language] || startOfWeekByLanguageCode[navigator.language.split('-')[0]];

  return index === 1 ? MONDAY_INDEX : SUNDAY_INDEX;
})();

export const weekDayNameList = Array.from({ length: DAYS_IN_WEEK }).map((_, i) =>
  new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(
    new Date(2024, 0, (startOfWeekIndex + i) % DAYS_IN_WEEK)
  )
);

export const today = (() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
})();

/* Month */
export const MONTHS_IN_YEAR = 12;
export const MONTHS_PER_COLUMN = 3;
export const monthNameList = Array.from({ length: MONTHS_IN_YEAR }).map((_, i) =>
  new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2024, i, 1))
);
export const englishMonthNameList = Array.from({ length: MONTHS_IN_YEAR }).map((_, i) =>
  new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2024, i, 1))
);

/* Year */
export const YEARS_PER_PAGE = 20;
export const YEARS_PER_COLUMN = 4;
export const MIDDLE_YEAR_INDEX = 9;
export const JANUARY_INDEX = 0;
export const DECEMBER_INDEX = 11;
