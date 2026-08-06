import React from 'react';
import styled from 'styled-components';
import WarningSVG from '@ui/atoms/icons/Warning-24.svg';
import { IconSvg } from '@ui/utils/IconSvg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  color: ${({ theme }) => theme.color.textPlaceholder};
  text-align: center;
  ${({ theme }) => theme.typography.uiElementSmall};
`;

export interface ListEmptyStateProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  'data-cy'?: string;
}

export const ListEmptyState = ({
  children,
  icon = <IconSvg as={WarningSVG} color={theme => theme.color.iconSubtle} aria-hidden />,
  'data-cy': dataCy,
}: ListEmptyStateProps): JSX.Element => (
  <Wrapper data-cy={dataCy}>
    {icon}
    {children}
  </Wrapper>
);
