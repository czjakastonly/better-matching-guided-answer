import { useContext } from 'react';
import notificationContext, { pushNotificationContext } from '@editorCommon/Contexts/notificationContext';

export function useNotifications() {
  const context = useContext(notificationContext);
  if (context === undefined) {
    throw new Error('Hey, use useNotifications inside notificationContext!');
  }

  return context;
}

export const usePushNotification = () => {
  const context = useContext(pushNotificationContext);
  if (context === undefined) {
    throw new Error('Hey, use usePushNotification inside pushNotificationContext/notificationContext!');
  }

  return context;
};
