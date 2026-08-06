import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Tabs from '@editorCommon/CustomElements/Tabs';
import Loader from '@editorCommon/CustomElements/Loader';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import { AI_SOURCE_USAGE, type AiSourceUsageType } from 'stonly-editor/model/aiSource/aiSource.enum';
import { StepOccurrencesList } from './StepOccurrencesList';
import { KbOccurrencesList } from './KbOccurrencesList';
import { KbAgentOccurrencesList } from './KbAgentOccurrencesList';
import { AiAgentOccurrencesList } from './AiAgentOccurrencesList';

const StyledTab = styled(Tabs)`
  margin-top: 16px;
  margin-bottom: 0;
  .tabSwitcher > :first-child {
    margin-left: 32px;
  }
`;

interface IsUsedInTableProps {
  teamId: number;
  framed?: boolean;
  isLoading: boolean;
  stepList?: AiSourceModel.AiSourceStepUsage[];
  knowledgeBaseList?: AiSourceModel.AiSourceKbUsage[];
  agentAssistKbList?: AiSourceModel.AiSourceKbUsage[];
  agentAssistReplyKbList?: AiSourceModel.AiSourceKbUsage[];
  agentList?: AiSourceModel.AiSourceAiAgentUsage[];
  displayColumnsList?: AiSourceUsageType[];
  kbRedirection?: 'settings' | 'ai';
}

export const OccurrencesTable = ({
  framed = false,
  isLoading,
  stepList = [],
  knowledgeBaseList = [],
  agentAssistKbList,
  agentAssistReplyKbList,
  agentList = [],
  teamId,
  displayColumnsList = [AI_SOURCE_USAGE.AI_AGENT, AI_SOURCE_USAGE.STEP, AI_SOURCE_USAGE.KB],
  kbRedirection = 'settings',
}: IsUsedInTableProps) => {
  const [activeTabId, setActiveTabId] = useState<AiSourceUsageType | undefined>(undefined);

  const { t } = useTranslation();

  const isAgentKbMode = agentAssistKbList !== undefined || agentAssistReplyKbList !== undefined;
  const agentAssistKbListSafe = agentAssistKbList ?? [];
  const agentAssistReplyKbListSafe = agentAssistReplyKbList ?? [];
  const totalKbCount = isAgentKbMode
    ? knowledgeBaseList.length + agentAssistKbListSafe.length + agentAssistReplyKbListSafe.length
    : knowledgeBaseList.length;

  const tabs = [
    {
      id: AI_SOURCE_USAGE.AI_AGENT,
      label: t('AiSources.AiAgentsTab', { counter: agentList.length }),
      content: (
        <ColumnFlex marginTop={2}>
          <AiAgentOccurrencesList items={agentList} framed={framed} teamId={teamId} />
        </ColumnFlex>
      ),
    },
    {
      id: AI_SOURCE_USAGE.STEP,
      label: t('AiSources.StepsTab', { counter: stepList.length }),
      content: (
        <ColumnFlex marginTop={2}>
          <StepOccurrencesList items={stepList} framed={framed} />
        </ColumnFlex>
      ),
    },
    {
      id: AI_SOURCE_USAGE.KB,
      label: t('AiSources.KnowledgeBasesTab', { counter: totalKbCount }),
      content: (
        <ColumnFlex marginTop={2}>
          {isAgentKbMode ? (
            <KbAgentOccurrencesList
              kb={knowledgeBaseList}
              agentAssist={agentAssistKbListSafe}
              agentAssistReply={agentAssistReplyKbListSafe}
              framed={framed}
              teamId={teamId}
              kbRedirection={kbRedirection}
            />
          ) : (
            <KbOccurrencesList
              items={knowledgeBaseList}
              framed={framed}
              teamId={teamId}
              kbRedirection={kbRedirection}
            />
          )}
        </ColumnFlex>
      ),
    },
  ].filter(tab => displayColumnsList.includes(tab.id as AiSourceUsageType));

  // Open tab with content if available
  useEffect(() => {
    if (!isLoading) {
      if (stepList.length > 0 && displayColumnsList.includes(AI_SOURCE_USAGE.STEP)) {
        setActiveTabId(AI_SOURCE_USAGE.STEP);
      } else if (
        (knowledgeBaseList.length > 0 ||
          (isAgentKbMode && (agentAssistKbListSafe.length > 0 || agentAssistReplyKbListSafe.length > 0))) &&
        displayColumnsList.includes(AI_SOURCE_USAGE.KB)
      ) {
        setActiveTabId(AI_SOURCE_USAGE.KB);
      } else if (agentList.length > 0 && displayColumnsList.includes(AI_SOURCE_USAGE.AI_AGENT)) {
        setActiveTabId(AI_SOURCE_USAGE.AI_AGENT);
      } else {
        setActiveTabId(displayColumnsList[0]);
      }
    }
  }, [
    isLoading,
    stepList,
    knowledgeBaseList,
    agentAssistKbListSafe,
    agentAssistReplyKbListSafe,
    agentList,
    displayColumnsList,
  ]);

  return isLoading || !activeTabId ? (
    <RowFlex marginTop={2} justifyContent="center">
      <Loader monochrome />
    </RowFlex>
  ) : (
    <StyledTab tabs={tabs} onClick={setActiveTabId} activeTabId={activeTabId} />
  );
};
