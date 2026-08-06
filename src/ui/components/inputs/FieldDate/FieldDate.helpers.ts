import { format } from 'date-fns';
import { englishMonthNameList, monthNameList } from '@ui/components/Calendar/Calendar.consts';
import { isValidDate } from '@ui/components/Calendar/Calendar.helpers';

const getUserDateFormat = (): string => {
  const userLocale = window.navigator.language;
  const formatParts = new Intl.DateTimeFormat(userLocale).formatToParts(new Date());

  const formatMap: { [key: string]: string } = {
    year: 'yyyy',
    month: 'MM',
    day: 'dd',
  };

  return formatParts.map(part => formatMap[part.type] || part.value).join('');
};

export const userDateFormat = getUserDateFormat();

const LITERAL_REGEXP = /[\s,./-]/;
const lowerCasedMonthNameList = monthNameList.map(name => name.toLowerCase());
const lowerCasedEnglishMonthNameList = englishMonthNameList.map(name => name.toLowerCase());

const isYear = (num: number): boolean => num > 1900 && num < 9999;
const isDay = (num: number): boolean => num > 12 && num <= 31;
const isMonth = (num: number): boolean => num >= 1 && num <= 12;

const getMonthIndexFromString = (monthString: string): number | null => {
  const lowerCased = monthString.toLowerCase();
  let index = lowerCasedMonthNameList.findIndex(name => name.startsWith(lowerCased));
  if (index === -1) {
    index = lowerCasedEnglishMonthNameList.findIndex(name => name.startsWith(lowerCased));
  }
  return index === -1 ? null : index;
};

export const parseDateString = (
  dateString: string | undefined,
  dateFormat: string = userDateFormat
): Date | undefined => {
  if (!dateString) {
    return undefined;
  }

  const parts = dateString.split(LITERAL_REGEXP).filter(Boolean);
  if (parts.length !== 3) {
    return undefined;
  }

  let day: number | null = null;
  let month: number | null = null;
  let year: number | null = null;

  const formatOrder = Array.from(new Set(dateFormat.replaceAll(/[^dmy]/gi, '')));

  if (formatOrder.length !== 3) {
    return undefined;
  }

  parts.forEach((part, index) => {
    const num = Number.parseInt(part, 10);

    if (isYear(num)) {
      year = num;
      return;
    }

    if (Number.isNaN(num)) {
      const monthIndex = getMonthIndexFromString(part);
      if (monthIndex !== null) {
        month = monthIndex + 1;
      }
      return;
    }

    if (isDay(num)) {
      day = num;
      return;
    }

    if (isMonth(num)) {
      const isDayOrder = formatOrder[index] === 'd';
      if (isDayOrder && day === null) {
        day = num;
      } else if (!isDayOrder && month === null) {
        month = num;
      }
    }
  });

  const remainingPart = parts.find(part => {
    const num = Number.parseInt(part, 10);
    return !Number.isNaN(num) && num !== year && num !== day && num !== month;
  });

  if (remainingPart) {
    const num = Number.parseInt(remainingPart, 10);
    if (day === null) {
      day = num;
    } else if (month === null) {
      month = num;
    }
  }

  if (day === null || month === null || year === null) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);
  return isValidDate(date) ? date : undefined;
};

export const getDateString = (dateValue: Date | string | undefined, dateFormat: string): string | undefined => {
  if (!dateValue) {
    return undefined;
  }

  const potentialDate = typeof dateValue === 'string' ? parseDateString(dateValue, dateFormat) : dateValue;

  if (potentialDate) {
    return format(potentialDate, dateFormat);
  }

  if (typeof dateValue === 'string') {
    return dateValue;
  }

  return undefined;
};
