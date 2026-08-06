import React, { forwardRef } from 'react';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { Dropdown } from '@ui/components/Dropdown';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import type { InputDropdownProps } from './InputDropdown.types';
import type { ButtonFieldSelectProps } from '../components/ButtonFieldSelect';
import { ButtonFieldSelect } from '../components/ButtonFieldSelect';

/** WIP */
export const InputDropdown = forwardRef<HTMLButtonElement, InputDropdownProps>(
  (
    {
      children,
      className,
      id: domId,
      label,
      labelTrigger,
      message,
      required,
      status,
      tooltip,
      // dropdown related props
      maxWidthRatio = 1,
      ...restDropdownAndButtonSelectProps
    },
    forwardedRef
  ) => {
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
        <Dropdown<ButtonFieldSelectProps>
          as={ButtonFieldSelect}
          aria-describedby={messageDomId}
          aria-labelledby={labelDomId}
          {...restDropdownAndButtonSelectProps}
          ref={forwardedRef}
          status={status}
          required={required}
          label={labelTrigger}
          id={id}
          maxWidthRatio={maxWidthRatio}
        >
          {children}
        </Dropdown>
      </InputWrap>
    );
  }
);
