import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useContentWrapRef } from '../../_shared/ContentWrapRefContext';

export interface DialogHeaderProps {
  iconLeft?: React.ReactNode;
  children: React.ReactNode;
  titleId?: string;
  showBottomDivider?: boolean;
}

const Header = styled.div<{ $showBottomDivider?: boolean }>`
  padding: 32px 64px 32px 32px;
  border-bottom: 1px solid ${props => props.theme.color.backgroundDefault};
  ${({ $showBottomDivider }) =>
    $showBottomDivider &&
    css`
      border-bottom-color: ${props => props.theme.color.borderSubtle};
    `}
`;

const IconLeftWrap = styled.div`
  margin-right: 16px;
  line-height: 0;
  flex-shrink: 0;

  svg {
    display: block;
  }
`;

const TitleText = styled.h2`
  ${props => props.theme.typography.h2};
  display: flex;
  align-items: center;
  color: ${props => props.theme.color.textDark};
  margin-bottom: 0;
  margin-top: 0;
`;

export const DialogHeader = ({ iconLeft, children, titleId, showBottomDivider }: DialogHeaderProps) => {
  const contentWrapRef = useContentWrapRef();
  const [isSeparatorVisible, setIsSeparatorVisible] = useState(false);

  /* detect if showing a separator (line above sticky header) is needed - only if we have content scrolled */
  useEffect(() => {
    const scrollableElement = contentWrapRef?.current;

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
  }, [contentWrapRef]);

  const isBottomDividerVisible = typeof showBottomDivider === 'boolean' ? showBottomDivider : isSeparatorVisible;

  return (
    <Header $showBottomDivider={isBottomDividerVisible}>
      <TitleText data-cy="dialogTitle" id={titleId}>
        {iconLeft && <IconLeftWrap aria-hidden>{iconLeft}</IconLeftWrap>}
        {children}
      </TitleText>
    </Header>
  );
};
