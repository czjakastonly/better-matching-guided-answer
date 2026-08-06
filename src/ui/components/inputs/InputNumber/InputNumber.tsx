import React, { forwardRef } from 'react';
import { FieldNumber } from '@ui/components/inputs/FieldNumber';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputNumberProps } from './InputNumber.types';

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  ({ className, id: domId, label, message, required, status, tooltip, ...restFieldNumberProps }, forwardedRef) => {
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
        status={status}
        tooltip={tooltip}
      >
        <FieldNumber
          aria-describedby={messageDomId}
          aria-labelledby={labelDomId}
          {...restFieldNumberProps}
          id={id}
          ref={forwardedRef}
          required={required}
          status={status}
        />
      </InputWrap>
    );
  }
);
