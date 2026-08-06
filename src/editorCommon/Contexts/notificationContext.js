import React from 'react';

const notificationContext = React.createContext({
  notifications: [],
  pushNotification: notification => {},
  removeNotification: notification => {},
  removeNotificationByKey: key => {},
});

export default notificationContext;

export const pushNotificationContext = React.createContext();
