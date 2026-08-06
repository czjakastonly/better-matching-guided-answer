import React, { forwardRef } from 'react';
import { FieldText } from '@ui/components/inputs/FieldText';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputTextProps } from './InputText.types';

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ className, id: domId, label, message, required, status, tooltip, ...restFieldTextProps }, forwardedRef) => {
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
        <FieldText
          aria-describedby={messageDomId}
          aria-labelledby={labelDomId}
          {...restFieldTextProps}
          id={id}
          ref={forwardedRef}
          required={required}
          status={status}
        />
      </InputWrap>
    );
  }
);
