import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import { QueryClientProvider } from '@tanstack/react-query';
import UiProviders from '@ui/providers';
import userContext from '@editorCommon/Contexts/userContext.js';
import notificationContext, { pushNotificationContext } from '@editorCommon/Contexts/notificationContext';
import { queryClient } from 'stonly-editor/Site/SiteRootProviders/QueryClientProvider';
import { theme } from './theme';
import { App } from './App';
import './i18n';
import './styles.css';

// Editor's styleCompatibility.shouldForwardProp (styled-components v5 default behavior)
function shouldForwardProp(propName: string, target: unknown) {
  if (typeof target === 'string') {
    return isPropValid(propName);
  }
  return true;
}

const DEMO_TEAM_ID = 1;
const userValue = {
  user: {
    userId: 1,
    name: 'Piotr Jakubek',
    email: 'piotr.jakubek@stonly.com',
    defaultLanguage: 'en',
    teams: [{ teamId: DEMO_TEAM_ID, rights: 'admin', owner: true, featureFlags: { BPA: 1 } }],
  },
};

const pushNotification = (notification: unknown) => {
  // eslint-disable-next-line no-console
  console.info('[demo notification]', notification);
};
const notificationValue = {
  notifications: [],
  pushNotification,
  removeNotification: () => undefined,
  removeNotificationByKey: () => undefined,
};

ReactDOM.render(
  <StyleSheetManager shouldForwardProp={shouldForwardProp}>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/app/general/1/aiAutomation/guidedAnswers']}>
          <userContext.Provider value={userValue}>
            <notificationContext.Provider value={notificationValue}>
              <pushNotificationContext.Provider value={pushNotification}>
                <UiProviders>
                  <App />
                </UiProviders>
              </pushNotificationContext.Provider>
            </notificationContext.Provider>
          </userContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StyleSheetManager>,
  document.getElementById('root')
);
