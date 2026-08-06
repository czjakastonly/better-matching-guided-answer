import React, { forwardRef } from 'react';
import { FieldTextareaAi } from '@ui/components/inputs/FieldTextareaAi';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputTextareaAiProps } from './InputTextareaAi.types';

export const InputTextareaAi = forwardRef<HTMLTextAreaElement, InputTextareaAiProps>(
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
        <FieldTextareaAi
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
