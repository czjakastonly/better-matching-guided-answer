import React, { useEffect, useState, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useListBodyRef } from './List';

const BASE_PADDING_PX = 8; // should be the same as in ListBody

const Container = styled.div<{ $showBottomDivider: boolean }>`
  position: sticky;
  top: 0;
  outline: none;
  padding: ${BASE_PADDING_PX}px;
  border-bottom: 1px solid ${props => props.theme.color.backgroundDefault};

  ${({ $showBottomDivider }) =>
    $showBottomDivider &&
    css`
      border-bottom-color: ${props => props.theme.color.borderSubtle};
    `}
  background: ${props => props.theme.color.backgroundDefault};
`;

export const ListHeader = forwardRef<HTMLDivElement, { children?: React.ReactNode; showBottomDivider?: boolean }>(
  ({ children, showBottomDivider, ...rest }, forwardedRef) => {
    const [isSeparatorVisible, setIsSeparatorVisible] = useState(false);

    const bodyRef = useListBodyRef();

    /* detect if showing a separator (line above sticky header) is needed - inly if we have content scrolled */
    useEffect(() => {
      const scrollableElement = bodyRef?.current;

      if (scrollableElement) {
        const onScroll = () => {
          setIsSeparatorVisible(scrollableElement.scrollTop > 1);
        };

        scrollableElement.addEventListener('scroll', onScroll);
        return () => {
          scrollableElement.removeEventListener('scroll', onScroll);
        };
      }
      return undefined;
    }, [bodyRef]);

    const isBottomDividerVisible = typeof showBottomDivider === 'boolean' ? showBottomDivider : isSeparatorVisible;

    return (
      <Container {...rest} ref={forwardedRef} $showBottomDivider={isBottomDividerVisible}>
        {children}
      </Container>
    );
  }
);
