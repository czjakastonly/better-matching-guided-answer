import React from 'react';
import { useTheme } from 'styled-components';
import { resolveBackColorForStatus } from '@ui/utils/status.helpers';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { BaseNotification } from './BaseNotification.styles';
import type { NotificationProps } from './Notifications.types';

export const NotificationSmall = ({
  className,
  children,
  severity = 'warning',
  onCloseClick,
  ...restDivProps
}: NotificationProps) => {
  const theme = useTheme();
  return (
    <BaseNotification.ContainerSmall
      {...restDivProps}
      className={mergeClassNames(STATIC_CLASS_NAME.notification, className)}
      $statusColor={resolveBackColorForStatus(theme, severity)}
    >
      <BaseNotification.ContentSmall aria-hidden>{children}</BaseNotification.ContentSmall>
      {onCloseClick && (
        <BaseNotification.CloseIconContainer>
          <BaseNotification.StyledCloseSVG onClick={onCloseClick} />
        </BaseNotification.CloseIconContainer>
      )}
    </BaseNotification.ContainerSmall>
  );
};
