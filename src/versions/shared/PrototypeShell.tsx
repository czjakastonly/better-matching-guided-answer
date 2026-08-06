import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { RowFlex, ColumnFlex } from '@ui/components/Flex';
import SubsectionMenu from '@editorCommon/CustomElements/SubsectionMenu/SubsectionMenu';
import ServerCalllSVG from '@editorCommon/resources/icons/serverCallMedium.svg';
import Header from 'stonly-editor/Site/Webapp/General/Header/Header.jsx';
import {
  AiProfileIcon,
  ExternalSourcesIcon,
  GuidedResponseIcon,
  SettingsIcon,
  CustomInstructionsIcon,
  AiAgentIcon,
} from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiAutomation.styles';

const DEMO_TEAM_ID = 1;

const WorkspaceBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 84px;
  padding: 0 24px 20px;
  background: ${({ theme }) => theme.mainColor};
  color: white;
  font-size: 24px;
  line-height: 30px;
  font-weight: 500;
  letter-spacing: -0.01em;
  flex: none;
  cursor: pointer;

  svg {
    color: rgba(255, 255, 255, 0.7);
    margin-top: 4px;
  }
`;

interface PrototypeShellProps {
  children: React.ReactNode;
}

export const PrototypeShell = ({ children }: PrototypeShellProps) => {
  const { t } = useTranslation();

  const sideMenuConfig = [
    {
      name: t('AdminConsole.AiAgents'),
      link: `/app/general/${DEMO_TEAM_ID}/aiAutomation/aiAgents`,
      icon: AiAgentIcon,
    },
    {
      name: t('AdminConsole.AiProfiles'),
      link: `/app/general/${DEMO_TEAM_ID}/aiAutomation/aiProfiles`,
      icon: AiProfileIcon,
    },
    {
      name: t('AdminConsole.CustomInstructions'),
      link: `/app/general/${DEMO_TEAM_ID}/aiAutomation/customInstructions`,
      icon: CustomInstructionsIcon,
    },
    {
      name: t('AiSources.GuidedAiAnswers'),
      link: `/app/general/${DEMO_TEAM_ID}/aiAutomation/guidedAnswers`,
      icon: GuidedResponseIcon,
    },
    {
      name: t('AdminConsole.ExternalSources'),
      link: `/app/general/${DEMO_TEAM_ID}/aiAutomation/externalSources`,
      icon: ExternalSourcesIcon,
    },
    {
      name: t('AdminConsole.AiSettings'),
      link: `/app/general/${DEMO_TEAM_ID}/aiAutomation/aiSettings`,
      icon: SettingsIcon,
    },
    {
      name: t('AdminConsole.ServerCalls'),
      link: `/app/general/${DEMO_TEAM_ID}/aiAutomation/serverCalls`,
      icon: ServerCalllSVG,
    },
  ];

  return (
    <ColumnFlex style={{ minHeight: '100vh' }}>
      <Route path="/app/general/:teamId/:section" component={Header} />
      <WorkspaceBar>
        Testing
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </WorkspaceBar>
      <RowFlex
        style={{
          height: 'calc(100vh - 136px)',
          background: 'white',
        }}
      >
        <SubsectionMenu options={sideMenuConfig} />
        <ColumnFlex flexShrink={0} flexGrow={1} style={{ overflowY: 'auto' }} paddingTop={0} padding={3}>
          {children}
        </ColumnFlex>
      </RowFlex>
    </ColumnFlex>
  );
};

export { DEMO_TEAM_ID };
