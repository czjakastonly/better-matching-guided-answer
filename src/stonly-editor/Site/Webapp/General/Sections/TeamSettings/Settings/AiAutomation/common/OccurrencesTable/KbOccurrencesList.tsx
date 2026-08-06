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
  KnowledgeBaseIcon,
  EmptyMessage,
} from './OccurrencesList.styles';

interface KbOccurrencesListProps {
  className?: string;
  items: AiSourceModel.AiSourceKbUsage[];
  framed?: boolean;
  teamId: number;
  kbRedirection: 'settings' | 'ai';
}

export const KbOccurrencesList = ({
  className,
  items,
  teamId,
  framed = false,
  kbRedirection = 'settings',
}: KbOccurrencesListProps) => {
  const { t } = useTranslation();

  const getKbRedirectionUrl = (knowledgeBaseId: number) => {
    switch (kbRedirection) {
      case 'settings': {
        return `${appUrl || ''}/app/general/${teamId}/knowledgeBase/${knowledgeBaseId}/Search`;
      }
      case 'ai': {
        return `${appUrl || ''}/app/general/${teamId}/knowledgeBase/${knowledgeBaseId}/AI`;
      }
      default: {
        return `${appUrl || ''}/app/general/${teamId}/knowledgeBase/${knowledgeBaseId}/Search`;
      }
    }
  };

  return (
    <ListWrapper className={className} framed={framed} gap={0.5} paddingX={2}>
      {items.length ? (
        items.map(({ rootFolderName, knowledgeBaseId }) => (
          <ListItem key={knowledgeBaseId} href={getKbRedirectionUrl(knowledgeBaseId)} target="_blank">
            <ColumnFlex flexGrow={1}>
              <ItemCanvas>
                <KnowledgeBaseIcon />
                {rootFolderName}
              </ItemCanvas>
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
