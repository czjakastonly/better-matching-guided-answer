import React from 'react';

import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputDateProps } from './InputDate.types';
import { FieldDate } from '../FieldDate';

export const InputDate = ({
  className,
  id: domId,
  label,
  message,
  required,
  tooltip,
  value,
  onChange,
  status,
  isFutureDisabled,
  isPastDisabled,
  dateFormat,
  disabled,
  ...restFieldTextProps
}: InputDateProps) => {
  const id = useDomId(domId);
  const labelDomId = generateLabelDomId(id, !!label);
  const messageDomId = generateDescribeDomId(id, !!message);

  return (
    <InputWrap
      className={className}
      label={label}
      labelDomId={labelDomId}
      message={message}
      messageDomId={messageDomId}
      required={required}
      tooltip={tooltip}
      status={status}
    >
      <FieldDate
        id={id}
        required={required}
        aria-describedby={messageDomId}
        aria-labelledby={labelDomId}
        value={value}
        onChange={onChange}
        status={status}
        isFutureDisabled={isFutureDisabled}
        isPastDisabled={isPastDisabled}
        dateFormat={dateFormat}
        disabled={disabled}
        {...restFieldTextProps}
      />
    </InputWrap>
  );
};
