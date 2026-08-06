import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { appUrl } from 'global/env';
import { ColumnFlex } from '@ui/components/Flex';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import {
  ListWrapper,
  ItemCanvas,
  ExternalLinkIcon,
  ListItem,
  GuideCanvas,
  TinyKnowledgeBaseIcon,
  EmptyMessage,
} from './OccurrencesList.styles';

interface KbAgentOccurrencesListProps {
  kb: AiSourceModel.AiSourceKbUsage[];
  agentAssist: AiSourceModel.AiSourceKbUsage[];
  agentAssistReply: AiSourceModel.AiSourceKbUsage[];
  framed?: boolean;
  teamId: number;
  kbRedirection?: 'settings' | 'ai';
}

type KbWithContext = AiSourceModel.AiSourceKbUsage & { contextKey: string; contextLabel: string };

export const KbAgentOccurrencesList = ({
  kb,
  agentAssist,
  agentAssistReply,
  teamId,
  framed = false,
  kbRedirection = 'settings',
}: KbAgentOccurrencesListProps) => {
  const { t } = useTranslation();

  const items: KbWithContext[] = useMemo(() => {
    const aiAnswersLabel = t('KnowledgeBaseSettings.Ai.AiAnswers');
    const agentAssistLabel = t('KnowledgeBaseSettings.Ai.AiAssistAgent');
    const agentReplyLabel = t('KnowledgeBaseSettings.Ai.AiAssistReplyAgent');

    return [
      ...kb.map(item => ({ ...item, contextKey: 'kb', contextLabel: aiAnswersLabel })),
      ...agentAssist.map(item => ({ ...item, contextKey: 'agentAssist', contextLabel: agentAssistLabel })),
      ...agentAssistReply.map(item => ({ ...item, contextKey: 'agentAssistReply', contextLabel: agentReplyLabel })),
    ].sort((a, b) => a.rootFolderName.localeCompare(b.rootFolderName));
  }, [kb, agentAssist, agentAssistReply, t]);

  const getKbUrl = (knowledgeBaseId: number) => {
    if (kbRedirection === 'ai') {
      return `${appUrl || ''}/app/general/${teamId}/knowledgeBase/${knowledgeBaseId}/AI`;
    }
    return `${appUrl || ''}/app/general/${teamId}/knowledgeBase/${knowledgeBaseId}/Search`;
  };

  return (
    <ListWrapper framed={framed} gap={0.5} paddingX={2}>
      {items.length ? (
        items.map(({ knowledgeBaseId, rootFolderName, contextKey, contextLabel }) => (
          <ListItem key={`${contextKey}-${knowledgeBaseId}`} href={getKbUrl(knowledgeBaseId)} target="_blank">
            <ColumnFlex flexGrow={1}>
              <ItemCanvas>{contextLabel}</ItemCanvas>
              <GuideCanvas>
                <TinyKnowledgeBaseIcon />
                {rootFolderName}
              </GuideCanvas>
            </ColumnFlex>
            <ExternalLinkIcon />
          </ListItem>
        ))
      ) : (
        <EmptyMessage paddingY={4} paddingX={2} justifyContent="center">
          {t('AiAutomation.ViewOccurrences.NoKnowledgeBases')}
        </EmptyMessage>
      )}
    </ListWrapper>
  );
};
