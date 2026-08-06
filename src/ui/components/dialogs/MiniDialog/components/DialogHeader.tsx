import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import ChevronLeftSVG from '@ui/atoms/icons/ChevronLeft-16.svg';
import { useContentWrapRef } from '../../_shared/ContentWrapRefContext';

export interface DialogHeaderProps {
  onBackClick?: () => void;
  children: React.ReactNode;
  titleId?: string;
  showBottomDivider?: boolean;
}

const Header = styled.div<{ $showBottomDivider?: boolean }>`
  display: flex;
  vertical-align: middle;
  padding: 12px 16px;
  gap: 8px;
  border-bottom: 1px solid ${props => props.theme.color.backgroundDefault};
  ${({ $showBottomDivider }) =>
    $showBottomDivider &&
    css`
      border-bottom-color: ${props => props.theme.color.borderSubtle};
    `}
`;

const TitleText = styled.h2`
  ${props => props.theme.typography.h3};
  display: flex;
  align-items: center;
  color: ${props => props.theme.color.textDark};
  margin-bottom: 0;
  margin-top: 0;
`;

export const DialogHeader = ({ onBackClick, children, titleId, showBottomDivider }: DialogHeaderProps) => {
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
      {onBackClick && (
        <div style={{ marginLeft: '-8px' }}>
          <ButtonMinimal iconOnly={<ChevronLeftSVG />} aria-label="back" size="small" onClick={onBackClick} />
        </div>
      )}
      <TitleText data-cy="dialogTitle" id={titleId}>
        {children}
      </TitleText>
    </Header>
  );
};
