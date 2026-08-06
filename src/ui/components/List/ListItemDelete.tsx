import React from 'react';

import DeleteSVG from '@ui/atoms/icons/Delete-16.svg';
import { ListItemStyles } from './_shared/styles';

export interface ListItemDeleteProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  label?: React.ReactNode;
  className?: never;
}

export const ListItemDelete = React.forwardRef<HTMLDivElement, ListItemDeleteProps>(
  ({ label, disabled, isHighlighted, isSelected, ...rest }, forwardedRef) => (
    <ListItemStyles.ContainerDelete
      {...rest}
      isDisabled={disabled}
      isHighlighted={isHighlighted}
      isSelected={isSelected}
      ref={forwardedRef}
    >
      <ListItemStyles.LeftIconContainer aria-hidden>
        <DeleteSVG />
      </ListItemStyles.LeftIconContainer>
      <ListItemStyles.TextContainer>
        <ListItemStyles.TitleContainer>
          <ListItemStyles.Title>{label}</ListItemStyles.Title>
        </ListItemStyles.TitleContainer>
      </ListItemStyles.TextContainer>
      {isSelected && <ListItemStyles.TickIcon aria-hidden />}
    </ListItemStyles.ContainerDelete>
  )
);
