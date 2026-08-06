import React from 'react';
import { renderStatusIconForStatus, resolveMainColorForStatus } from '@ui/utils/status.helpers';
import { useTheme } from 'styled-components';
import { BaseToast } from './BaseToast.styles';
import { BaseNotification } from './BaseNotification.styles';

import type { ToastProps } from './Notifications.types';

// @design-system WIP
export const Toast = ({ className, children, dataCy, severity = 'info', onCloseClick, onActionClick }: ToastProps) => {
  const theme = useTheme();
  return (
    <BaseToast.Container className={className} $statusColor={resolveMainColorForStatus(theme, severity)}>
      <BaseToast.IconContainer>{renderStatusIconForStatus(severity)}</BaseToast.IconContainer>
      <BaseToast.Content data-cy={dataCy}>{children}</BaseToast.Content>
      {onActionClick && <BaseToast.ActionButton onClick={onActionClick}>action</BaseToast.ActionButton>}
      {onCloseClick && (
        <BaseNotification.CloseIconContainer>
          <BaseToast.StyledCloseSVG onClick={onCloseClick} />
        </BaseNotification.CloseIconContainer>
      )}
    </BaseToast.Container>
  );
};
