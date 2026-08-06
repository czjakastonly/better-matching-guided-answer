import React from 'react';

import { ListItemStandard } from '@ui/components/List';

import { type ActionProps } from './_shared/types';
import { useMenuAction } from './_shared/useMenuAction';

export const Action = <Payload,>({
  action,
  payload,
  disabled,
  ...restRenderOptionComponentProps
}: ActionProps<Payload>) => {
  const { isHighlighted, onClick, itemDomProps } = useMenuAction({
    disabled,
    action,
    payload,
    // no uuid - put value here for easier debugging
  });

  return (
    <ListItemStandard
      {...restRenderOptionComponentProps}
      {...itemDomProps}
      disabled={disabled}
      isHighlighted={isHighlighted}
      onClick={onClick}
    />
  );
};
