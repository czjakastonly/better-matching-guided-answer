import React from 'react';

import { ListItemStandard } from '@ui/components/List';

import { type OptionProps } from './_shared/types';
import { useSelectOption } from './_shared/useSelectOption';

export const Option = ({
  label,
  value,
  iconLeft,
  description,
  disabled,
  ...restRenderOptionComponentProps
}: OptionProps) => {
  const { isHighlighted, isSelected, onClick, itemDomProps } = useSelectOption({
    disabled,
    payload: { label, value, iconLeft, description },
    value,
    // no uuid - put value here for easier debugging
  });

  return (
    <ListItemStandard
      {...restRenderOptionComponentProps}
      description={description}
      disabled={disabled}
      iconLeft={iconLeft}
      isHighlighted={isHighlighted}
      isSelected={isSelected}
      label={label}
      onClick={onClick}
      {...itemDomProps}
    />
  );
};
