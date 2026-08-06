import React from 'react';
import styled from 'styled-components';
import { useMergeRefs } from '@ui/utils/mergeRefs';
import { useListBodyRef } from './List';

/*
  why is this even needed? Because some other list-related component styling may have relation to it
  (ex. negative margin in ListHeader is the same as padding here)
*/
export const ListBodyComponent = styled.div`
  outline: none;
  padding: 8px;
  overflow: auto;
  scroll-padding: 48px 0 48px 0;
  ${({ theme }) => theme.scrollbars.basic};
`;

export const ListBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, forwardedRef) => {
    const bodyRef = useListBodyRef();

    const mergedBodyRef = useMergeRefs(bodyRef, forwardedRef);

    return <ListBodyComponent ref={mergedBodyRef} {...props} />;
  }
);
