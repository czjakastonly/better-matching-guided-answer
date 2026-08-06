import React from 'react';
import {
  renderStatusIconForStatus,
  resolveBackColorForStatus,
  resolveMainColorForStatus,
} from '@ui/utils/status.helpers';
import { useTheme } from 'styled-components';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { BaseNotification } from './BaseNotification.styles';
import type { NotificationProps } from './Notifications.types';

export const Notification = ({
  className,
  children,
  severity = 'warning',
  hasIcon = true,
  onCloseClick,
  ...restDivProps
}: NotificationProps) => {
  const theme = useTheme();

  return (
    <BaseNotification.Container
      {...restDivProps}
      className={mergeClassNames(STATIC_CLASS_NAME.notification, className)}
      data-notification-status={severity}
      $statusColor={resolveBackColorForStatus(theme, severity)}
    >
      {hasIcon && (
        <BaseNotification.StatusIconContainer aria-hidden $statusColor={resolveMainColorForStatus(theme, severity)}>
          {renderStatusIconForStatus(severity)}
        </BaseNotification.StatusIconContainer>
      )}
      <BaseNotification.Content>{children}</BaseNotification.Content>
      {onCloseClick && (
        <BaseNotification.CloseIconContainer data-func="close">
          <BaseNotification.StyledCloseSVG onClick={onCloseClick} />
        </BaseNotification.CloseIconContainer>
      )}
    </BaseNotification.Container>
  );
};
