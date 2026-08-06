import React, { forwardRef } from 'react';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { Select } from '@ui/components/Select';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputSelectProps } from './InputSelect.types';
import type { ButtonFieldSelectProps } from '../components/ButtonFieldSelect';
import { ButtonFieldSelect } from '../components/ButtonFieldSelect';

export const InputSelect = forwardRef<HTMLButtonElement, InputSelectProps>(
  ({ children, className, id: domId, label, message, required, status, tooltip, ...restSelectProps }, forwardedRef) => {
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
        <Select<ButtonFieldSelectProps>
          as={ButtonFieldSelect}
          status={status}
          aria-describedby={messageDomId}
          aria-labelledby={labelDomId}
          {...restSelectProps}
          id={id}
          ref={forwardedRef}
        >
          {children}
        </Select>
      </InputWrap>
    );
  }
);
