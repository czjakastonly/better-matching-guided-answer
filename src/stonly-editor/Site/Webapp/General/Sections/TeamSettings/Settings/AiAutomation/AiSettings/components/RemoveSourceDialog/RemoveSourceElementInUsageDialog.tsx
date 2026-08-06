import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { AiSourceApi } from 'stonly-editor/api/aiSource/aiSource.api';
import { ColumnFlex } from '@ui/components/Flex';
import { ActionsDialog } from '@ui/components/dialogs/ActionsDialog';
import { escapeHTML } from '@stonlyCommons/helpers/sanitizeHelpers';
import { AI_SOURCE_USAGE } from 'stonly-editor/model/aiSource/aiSource.enum';
import { getTranslationMainKey } from '../../helpers/i18n.helper';
import { getSourceUrl } from '../../helpers/source.helper';
import { OccurrencesTable } from '../../../common/OccurrencesTable/OccurrencesTable';
import { type RemoveSourceElementDialogProps } from './RemoveSourceElementDialog';
import { TextWithLink } from './RemoveSourceDialog.styles';

export const RemoveSourceElementInUsageDialog = ({
  sourceElement,
  teamId,
  onDelete,
  onClose,
  type,
}: RemoveSourceElementDialogProps) => {
  const { t } = useTranslation();
  const translationMainKey = getTranslationMainKey(type, true);
  const { searchSourceElementId, name, url } = sourceElement;
  const sourceUrl = getSourceUrl({ url, type, isElement: true });

  const { data: sourceUsage, isLoading } = useQuery({
    queryKey: [AiSourceApi.sourceElementUsageQueryKey, teamId, searchSourceElementId],
    queryFn: () => AiSourceApi.getSourceElementUsageById({ teamId, searchSourceElementId, includeGroup: true }),
    placeholderData: { step: [], kb: [], agentAssist: [], agentAssistReply: [], aiAgents: [] },
    enabled: !!teamId && !!searchSourceElementId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const totalUsageCount =
    (sourceUsage?.step?.length ?? 0) +
    (sourceUsage?.kb?.length ?? 0) +
    (sourceUsage?.agentAssist?.length ?? 0) +
    (sourceUsage?.agentAssistReply?.length ?? 0) +
    (sourceUsage?.aiAgents?.length ?? 0);

  return (
    <ActionsDialog
      title={t(`${translationMainKey}InUseTitle`)}
      primaryAction={() => {
        onDelete();
        onClose();
      }}
      primaryLabel={t('Global.Delete')}
      primaryIsDisabled={totalUsageCount > 0}
      secondaryAction={onClose}
      secondaryLabel={t('Global.Cancel')}
      size="small"
      closeAction={onClose}
    >
      <ColumnFlex gap={3} marginBottom={2}>
        <span>
          {t(`${translationMainKey}DeleteSourceInUseContent`, {
            sourceName: escapeHTML(name),
          })}
        </span>
        {!!sourceUrl && <TextWithLink>{t(`${translationMainKey}SourceUrl`, { sourceUrl })}</TextWithLink>}
      </ColumnFlex>
      <OccurrencesTable
        isLoading={isLoading}
        stepList={sourceUsage?.step ?? []}
        knowledgeBaseList={sourceUsage?.kb ?? []}
        agentAssistKbList={sourceUsage?.agentAssist ?? []}
        agentAssistReplyKbList={sourceUsage?.agentAssistReply ?? []}
        agentList={sourceUsage?.aiAgents ?? []}
        teamId={teamId}
        displayColumnsList={[AI_SOURCE_USAGE.AI_AGENT, AI_SOURCE_USAGE.STEP, AI_SOURCE_USAGE.KB]}
        kbRedirection="ai"
        framed
      />
    </ActionsDialog>
  );
};
