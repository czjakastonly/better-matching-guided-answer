import React from 'react';

import { ListItemDelete } from '@ui/components/List';

import { type ActionProps } from './_shared/types';
import { useMenuAction } from './_shared/useMenuAction';

export const ActionDelete = <T,>({
  action,
  payload,
  className: unused, // eslint-disable-line @typescript-eslint/no-unused-vars
  disabled,
  ...restRenderOptionComponentProps
}: ActionProps<T>) => {
  const { isHighlighted, onClick, itemDomProps } = useMenuAction({
    disabled,
    action,
    payload,
    // no uuid - put value here for easier debugging
  });

  return (
    <ListItemDelete
      {...restRenderOptionComponentProps}
      {...itemDomProps}
      disabled={disabled}
      isHighlighted={isHighlighted}
      onClick={onClick}
    />
  );
};
