import React, { forwardRef } from 'react';
import { FieldTextarea } from '@ui/components/inputs/FieldTextarea';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputTextareaProps } from './InputTextarea.types';

export const InputTextarea = forwardRef<HTMLTextAreaElement, InputTextareaProps>(
  ({ className, id: domId, label, message, required, status, tooltip, ...restFieldTextareaProps }, forwardedRef) => {
    const id = useDomId(domId);
    const labelDomId = generateLabelDomId(id, !!label);
    const messageDomId = generateDescribeDomId(id, !!message);

    return (
      <InputWrap
        required={required}
        status={status}
        message={message}
        label={label}
        className={className}
        messageDomId={messageDomId}
        labelDomId={labelDomId}
        tooltip={tooltip}
      >
        <FieldTextarea
          aria-describedby={messageDomId}
          aria-labelledby={labelDomId}
          {...restFieldTextareaProps}
          id={id}
          ref={forwardedRef}
          required={required}
          status={status}
        />
      </InputWrap>
    );
  }
);
