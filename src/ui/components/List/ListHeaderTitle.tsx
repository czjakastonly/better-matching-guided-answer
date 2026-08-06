import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { ListItemStyles } from './_shared/styles';
import { ButtonMinimal } from '../buttons/ButtonMinimal';
import { ButtonStyles } from '../buttons/_shared/styles';

export interface ListHeaderTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  onBackClick?: () => void;
  children?: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  padding: 4px 0px 4px 12px;
  align-items: center;
  gap: 8px;
  ${ButtonStyles.MinimalButtonElement} {
    margin-left: -6px;
  }
`;

export const ListHeaderTitle = forwardRef<HTMLDivElement, ListHeaderTitleProps>(
  ({ children, onBackClick, ...rest }, forwardedRef) => {
    return (
      <Container ref={forwardedRef} {...rest}>
        {onBackClick && (
          <ButtonMinimal
            iconOnly={<ListItemStyles.ChevronLeftIcon />}
            onClick={onBackClick}
            aria-label="back"
            size="small"
          />
        )}
        <ListItemStyles.HeaderTitle>{children}</ListItemStyles.HeaderTitle>
      </Container>
    );
  }
);
