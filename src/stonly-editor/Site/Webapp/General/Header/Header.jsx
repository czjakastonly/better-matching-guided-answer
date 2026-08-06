import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link, withRouter } from 'react-router-dom';
import TextLink from '@editorCommon/StandardElements/TextLink/TextLink.jsx';
import LoginOrOut from '@editorCommon/Commons/LoginOrOut/LoginOrOut.jsx';
import { useGetTeamPermission } from '@editorCommon/hooks/usePermissions';
import { baseDomain } from 'global/env';
import { Canvas, Left, Menu, Right, SiteLogo } from './HeaderStyle.js';

export const TopMenuItem = styled(TextLink)`
  margin-left: 32px;

  &:first-child {
    margin-left: 0;
  }
`;

const LogoLink = styled(Link)`
  font-size: 0;
  margin-bottom: -6px;
  margin-top: -3px;
`;

const Header = ({ match }) => {
  const { teamId, section: currentSection } = match.params;
  const teamIdToUse = Number.isNaN(+teamId) ? -1 : +teamId;

  const { t } = useTranslation();
  const [getTeamPermission, PERMISSION] = useGetTeamPermission();
  const canUseKnowledgeAgents = getTeamPermission(PERMISSION.CAN_USE_KNOWLEDGE_AGENTS, teamIdToUse);

  return (
    <Canvas>
      <Left>
        <LogoLink to={`/app/general/${teamIdToUse}/content/`}>
          <SiteLogo />
        </LogoLink>
        <Menu data-cy="menu">
          {canUseKnowledgeAgents && (
            <TopMenuItem
              absolute
              dataCy="knowledgeAgentsMenu"
              type="darkBg"
              href={`https://knowledge-agent.${baseDomain}/${teamIdToUse}/chats`}
            >
              {t('Console.KnowledgeAgents')}
            </TopMenuItem>
          )}
          <TopMenuItem
            selected={currentSection === 'content'}
            type="darkBg"
            href={`/app/general/${teamIdToUse}/content/`}
            dataCy="guidesMenu"
            dataStonlyTrigger="content"
          >
            {t('Console.Content')}
          </TopMenuItem>
          <TopMenuItem
            dataCy="knowledgeBaseMenu"
            dataStonlyTrigger="knowledgeBase"
            selected={currentSection === 'knowledgeBase'}
            type="darkBg"
            href={`/app/general/${teamIdToUse}/knowledgeBase/`}
          >
            {t('Console.KnowledgeBase')}
          </TopMenuItem>
          <TopMenuItem
            dataCy="widgetMenu"
            dataStonlyTrigger="widget"
            selected={currentSection === 'widget'}
            type="darkBg"
            href={`/app/general/${teamIdToUse}/widget/`}
          >
            {t('Console.Widget')}
          </TopMenuItem>
          <TopMenuItem
            dataCy="aiAutomationMenu"
            selected={currentSection === 'aiAutomation'}
            type="darkBg"
            href={`/app/general/${teamIdToUse}/aiAutomation/`}
            dataStonlyTrigger="aiAutomation"
          >
            {t('Console.AiAutomation')}
          </TopMenuItem>
          <TopMenuItem
            selected={currentSection === 'insights'}
            type="darkBg"
            href={`/app/general/${teamIdToUse}/insights/`}
            dataStonlyTrigger="insights"
          >
            {t('Console.GlobalInsights')}
          </TopMenuItem>
        </Menu>
      </Left>

      <Right>
        <LoginOrOut />
      </Right>
    </Canvas>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  match: PropTypes.object,
};

export default withRouter(Header);
