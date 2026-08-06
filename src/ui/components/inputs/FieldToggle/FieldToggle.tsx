import React, { forwardRef } from 'react';
import { VisuallyHidden } from '@ui/components/VisuallyHidden';
import { useDomId } from '@ui/utils/domId';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { type FieldToggleProps } from './FieldToggle.types';
import FieldToggleStyles from './FieldToggle.styles';

export const FieldToggle = forwardRef<HTMLInputElement, FieldToggleProps>(
  (
    {
      checked,
      disabled,
      id: domId,
      name,
      onChange,
      onChangeChecked,
      onKeyDown,
      size = 'standard',
      ...restHtmlCheckboxProps
    },
    forwardedRef
  ) => {
    const id = useDomId(domId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        const newChecked = !checked;
        onChange?.(e);
        onChangeChecked?.(newChecked, name);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.key === 'Enter') {
        handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <FieldToggleStyles.Label $size={size}>
        <VisuallyHidden
          {...restHtmlCheckboxProps}
          as="input"
          className={STATIC_CLASS_NAME.fieldToggle}
          ref={forwardedRef}
          name={name}
          disabled={disabled}
          id={id}
          type="checkbox"
          checked={!!checked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <FieldToggleStyles.Slider $size={size} $checked={!!checked} $disabled={disabled} />
      </FieldToggleStyles.Label>
    );
  }
);
