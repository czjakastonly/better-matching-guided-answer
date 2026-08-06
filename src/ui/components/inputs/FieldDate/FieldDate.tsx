import React, { useState, useCallback, useEffect } from 'react';

import { Calendar } from '@ui/components/Calendar';
import { today } from '@ui/components/Calendar/Calendar.consts';
import { isValidDate } from '@ui/components/Calendar/Calendar.helpers';
import { FieldText } from '@ui/components/inputs/FieldText';
import { useFloatingDropdown } from '@ui/components/Dropdown/useFloatingDropdown';
import { Popover } from '@ui/components/Popover';
import { useDomId } from '@ui/utils/domId';
import CalendarSVG from '@ui/atoms/icons/Calendar-16.svg';
import { parseDateString, userDateFormat, getDateString } from './FieldDate.helpers';
import type { FieldDateProps } from './FieldDate.types';

export const FieldDate = ({
  id: domId,
  required,
  value,
  onChange,
  status,
  isFutureDisabled,
  isPastDisabled,
  dateFormat = userDateFormat,
  disabled,
  translations,
  ...restFieldTextProps
}: FieldDateProps) => {
  const [internalDateStringValue, setInternalDateStringValue] = useState<string | undefined>(() =>
    getDateString(value, dateFormat)
  );
  const [internalDateValue, setInternalDateValue] = useState<Date | undefined>(() =>
    parseDateString(internalDateStringValue, dateFormat)
  );

  const id = useDomId(domId);
  const popoverId = id ? `${id}:popover` : undefined;

  const { triggerProps, floatingProps, isOpen, close, open } = useFloatingDropdown({
    widthPx: 312,
    minWidthRatio: 0,
    maxWidthRatio: 2,
    closingKeyList: ['Escape'],
  });

  const validateDateValue = useCallback(
    (date?: Date) => {
      if (!isValidDate(date)) {
        return false;
      }

      if (isPastDisabled && date < today) {
        return false;
      }

      // eslint-disable-next-line sonarjs/prefer-single-boolean-return
      if (isFutureDisabled && date > today) {
        return false;
      }

      return true;
    },
    [isPastDisabled, isFutureDisabled]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isOpen && ['ArrowDown', 'Enter'].includes(e.key)) {
        open();
        e.preventDefault();
      }
      if (!isOpen && e.key === 'ArrowUp') {
        close();
        e.preventDefault();
      }

      if (!isOpen && !['Tab', 'Escape'].includes(e.key)) {
        // request animation frame is used because without it for some reason the character is not populated to input
        requestAnimationFrame(open);
      }
    },
    [open, close, isOpen]
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      open();
      e.preventDefault();
    },
    [open]
  );

  const onBlur = useCallback(() => {
    if (!internalDateValue) {
      onChange?.(undefined);
      return;
    }

    const isValid = validateDateValue(internalDateValue);

    if (isValid) {
      setInternalDateStringValue(getDateString(internalDateValue, dateFormat));
      onChange?.(internalDateValue);
    }
  }, [internalDateValue, dateFormat, onChange, validateDateValue]);

  const onInternalDateStringValueChange = useCallback(
    (newValue: string) => {
      setInternalDateStringValue(newValue);

      if (!newValue) {
        setInternalDateValue(undefined);
        return;
      }

      const potentialDate = parseDateString(newValue, dateFormat);
      const isValid = validateDateValue(potentialDate);

      if (isValid) {
        setInternalDateValue(potentialDate);
      }
    },
    [validateDateValue, dateFormat]
  );

  const onCalendarSelect = (date: Date) => {
    onChange?.(date);
    setInternalDateValue(date);
    setInternalDateStringValue(getDateString(date, dateFormat));

    close();
  };

  useEffect(() => {
    const newInternalDateStringValue = getDateString(value, dateFormat);
    const newInternalDate = parseDateString(newInternalDateStringValue, dateFormat);

    if (!newInternalDateStringValue) {
      setInternalDateStringValue(undefined);
      setInternalDateValue(undefined);
      return;
    }

    const isValid = validateDateValue(newInternalDate);

    if (isValid) {
      setInternalDateStringValue(newInternalDateStringValue);
      setInternalDateValue(newInternalDate);
    }
  }, [value, dateFormat, validateDateValue]);

  return (
    <>
      <FieldText
        id={id}
        placeholder={dateFormat}
        required={required}
        status={status}
        disabled={disabled}
        iconLeft={<CalendarSVG />}
        {...restFieldTextProps}
        value={internalDateStringValue}
        onChangeValue={onInternalDateStringValueChange}
        {...triggerProps}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onClick={onClick}
        aria-controls={popoverId}
        aria-haspopup="dialog"
      />

      {isOpen && (
        <Popover {...floatingProps} isFocusLocked id={popoverId}>
          <Calendar
            onSelect={onCalendarSelect}
            isFutureDisabled={isFutureDisabled}
            isPastDisabled={isPastDisabled}
            value={internalDateValue}
            translations={translations}
          />
        </Popover>
      )}
    </>
  );
};
