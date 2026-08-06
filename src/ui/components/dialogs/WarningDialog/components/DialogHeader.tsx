import React from 'react';
import styled from 'styled-components';
import { renderStatusIconForStatus, resolveMainColorForStatus } from '@ui/utils/status.helpers';
import type { WarningDialogSeverity } from '../WarningDialog.types';

export interface DialogHeaderProps {
  children: React.ReactNode;
  severity: WarningDialogSeverity;
  icon?: React.ReactNode;
  titleId?: string;
}

const Container = styled.div`
  padding: 40px 32px 16px 32px;
  text-align: center;
`;

const IconContainer = styled.div<{ severity: WarningDialogSeverity }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${({ theme, severity }) => resolveMainColorForStatus(theme, severity)}1A;
  margin: 0 auto;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > * {
    path {
      fill: ${({ theme, severity }) => resolveMainColorForStatus(theme, severity)};
    }
  }
`;

const TitleText = styled.h2`
  ${props => props.theme.typography.h2};
  display: block;
  align-items: center;
  color: ${props => props.theme.color.textDark};
  margin-bottom: 0;
  margin-top: 0;
`;

/**
 * Displays Large centered icon with h2 text below.
 * Requires icon XOR severity prop
 */
export const DialogHeader = ({ children, icon, severity, titleId }: DialogHeaderProps) => {
  return (
    <Container>
      <IconContainer aria-hidden severity={severity}>
        {icon || renderStatusIconForStatus(severity, '24')}
      </IconContainer>
      <TitleText data-cy="dialogTitle" id={titleId}>
        {children}
      </TitleText>
    </Container>
  );
};
