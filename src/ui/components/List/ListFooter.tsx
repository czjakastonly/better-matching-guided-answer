import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { useListBodyRef } from './List';

const BASE_PADDING_PX = 8; // should be the same as in ListBody

const Container = styled.div`
  position: sticky;
  bottom: 0;
  outline: none;
  padding: ${BASE_PADDING_PX}px;
  border-top: 1px solid ${props => props.theme.color.borderSubtle};
`;

export const ListFooter = forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
  ({ children, ...rest }, forwardedRef) => {
    useListBodyRef(); // will WARN if using <ListFooter> not inside <List>

    return (
      <Container {...rest} ref={forwardedRef}>
        {children}
      </Container>
    );
  }
);
