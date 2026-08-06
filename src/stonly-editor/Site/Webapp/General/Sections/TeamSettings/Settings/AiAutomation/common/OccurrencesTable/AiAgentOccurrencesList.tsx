import React from 'react';
import { useTranslation } from 'react-i18next';
import { appUrl } from 'global/env';
import { ColumnFlex } from '@ui/components/Flex';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import {
  ListWrapper,
  ItemCanvas,
  ExternalLinkIcon,
  ListItem,
  AiAgentIcon,
  EmptyMessage,
} from './OccurrencesList.styles';

interface AiAgentOccurrencesListProps {
  className?: string;
  items: AiSourceModel.AiSourceAiAgentUsage[];
  framed?: boolean;
  teamId: number;
}

export const AiAgentOccurrencesList = ({ className, items, teamId, framed = false }: AiAgentOccurrencesListProps) => {
  const { t } = useTranslation();

  return (
    <ListWrapper className={className} framed={framed} gap={0.5} paddingX={2}>
      {items.length ? (
        items.map(({ teamAiAgentName, typeId }) => (
          <ListItem
            key={typeId}
            href={`${appUrl || ''}/app/general/${teamId}/aiAutomation/aiAgents/${typeId}`}
            target="_blank"
          >
            <ColumnFlex flexGrow={1}>
              <ItemCanvas>
                <AiAgentIcon />
                {teamAiAgentName}
              </ItemCanvas>
            </ColumnFlex>
            <ExternalLinkIcon />
          </ListItem>
        ))
      ) : (
        <EmptyMessage paddingY={4} paddingX={2} justifyContent="center">
          {t('AiAutomation.ViewOccurrences.NoAiAgents')}
        </EmptyMessage>
      )}
    </ListWrapper>
  );
};
