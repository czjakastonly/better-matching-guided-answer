import React, { forwardRef } from 'react';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputColorProps } from './InputColor.types';
import { FieldText } from '../FieldText';
import { ButtonAdditionalAction } from '../components/ButtonAdditionalAction';
import { ColorRect } from '../components/ColorRect';

export const InputColor = forwardRef<HTMLInputElement, InputColorProps>(
  (
    { className, disabled, id: domId, label, message, required, status, value, tooltip, ...restFieldTextProps },
    forwardedRef
  ) => {
    const id = useDomId(domId);
    const messageDomId = generateDescribeDomId(id, !!message);
    const labelDomId = generateLabelDomId(id, !!label);

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
        <FieldText
          additionalActionNode={
            <ButtonAdditionalAction iconOnly={<ColorRect colorValue={value} />} disabled={disabled} />
          }
          aria-describedby={messageDomId}
          aria-labelledby={labelDomId}
          {...restFieldTextProps}
          disabled={disabled}
          id={id}
          ref={forwardedRef}
          required={required}
          status={status}
          value={value}
        />
      </InputWrap>
    );
  }
);
