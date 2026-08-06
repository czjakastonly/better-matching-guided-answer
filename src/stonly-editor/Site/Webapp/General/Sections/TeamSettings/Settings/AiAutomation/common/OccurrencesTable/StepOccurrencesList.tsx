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
  GuideCanvas,
  TinyExplanationIcon,
  EmptyMessage,
} from './OccurrencesList.styles';

interface StepOccurrencesListProps {
  className?: string;
  items: AiSourceModel.AiSourceStepUsage[];
  framed?: boolean;
}

export const StepOccurrencesList = ({ className, items, framed = false }: StepOccurrencesListProps) => {
  const { t } = useTranslation();

  return (
    <ListWrapper className={className} framed={framed} gap={0.5} paddingX={2}>
      {items.length ? (
        items.map(({ guideId, guideTitle, typeId, stepModuleTitle }) => (
          <ListItem key={typeId} href={`${appUrl || ''}/app/guide/${guideId}/editor/${typeId}`} target="_blank">
            <ColumnFlex flexGrow={1}>
              <ItemCanvas>{stepModuleTitle}</ItemCanvas>
              <GuideCanvas>
                <TinyExplanationIcon />
                {guideTitle}
              </GuideCanvas>
            </ColumnFlex>
            <ExternalLinkIcon />
          </ListItem>
        ))
      ) : (
        <EmptyMessage paddingY={4} paddingX={2} justifyContent="center">
          {t('AiAutomation.ViewOccurrences.NoSteps')}
        </EmptyMessage>
      )}
    </ListWrapper>
  );
};
