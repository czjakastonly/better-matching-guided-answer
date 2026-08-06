import type React from 'react';
import { type CALENDAR_SCREEN_TYPE } from './Calendar.consts';
import { type DayPickerTranslations } from './_shared/DayPicker';
import { type MonthPickerTranslations } from './_shared/MonthPicker';
import { type YearPickerTranslations } from './_shared/YearPicker';

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value?: Date | string;
  onSelect?: (date: Date) => void;
  isFutureDisabled?: boolean;
  isPastDisabled?: boolean;
  translations?: DayPickerTranslations & MonthPickerTranslations & YearPickerTranslations;
}

export type CalendarScreen = (typeof CALENDAR_SCREEN_TYPE)[keyof typeof CALENDAR_SCREEN_TYPE];
