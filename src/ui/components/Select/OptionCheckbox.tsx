import React from 'react';

import { ListItemCheckbox } from '@ui/components/List';

import { type OptionProps } from './_shared/types';
import { useSelectOption } from './_shared/useSelectOption';

/**
 * Like {@link Option}, but renders a left-aligned checkbox (`ListItemCheckbox`) instead of the
 * trailing tick. Use inside `SelectMultiple` when the dropdown should read as a checklist.
 */
export const OptionCheckbox = ({ label, value, disabled }: OptionProps): JSX.Element => {
  const { isHighlighted, isSelected, onClick, itemDomProps } = useSelectOption({
    disabled,
    payload: { label, value },
    value,
    // no uuid - put value here for easier debugging
  });

  return (
    <ListItemCheckbox
      disabled={disabled}
      isHighlighted={isHighlighted}
      isSelected={isSelected}
      label={label}
      onClick={onClick}
      {...itemDomProps}
    />
  );
};
