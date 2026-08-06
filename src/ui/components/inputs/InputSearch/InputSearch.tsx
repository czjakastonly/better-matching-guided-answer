import React, { forwardRef } from 'react';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputSearchProps } from './InputSearch.types';
import { FieldSearch } from '../FieldSearch';

export const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
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
        <FieldSearch
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
