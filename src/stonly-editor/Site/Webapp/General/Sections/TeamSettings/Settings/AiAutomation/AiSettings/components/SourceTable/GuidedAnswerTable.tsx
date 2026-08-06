import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import displayDate from '@stonlyCommons/helpers/dateManagement.js';
import Table from '@editorCommon/CustomElements/Table/index.jsx';
import {
  SearchEmptyWrap,
  SearchEmptyIcon,
  SearchEmptyText,
  StyledLoader,
} from '@editorCommon/CommonStyledComponents/SettingsStyles.jsx';
import {
  AI_SOURCE,
  AI_SOURCE_SORT_KEY,
  AI_SOURCE_STATUS,
  GUIDED_ANSWER_LAUNCH_MODE,
  GUIDED_ANSWER_MATCHING_MODE,
} from 'stonly-editor/model/aiSource/aiSource.enum';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import { useIsIntentProcessingMock } from '../GuidedAnswer/useIntentProcessingMock';
import EmptyGuidedAnswerSVG from '@ui/atoms/icons/EmptyGuidedAnswer-72.svg';
import { ButtonPrimary } from '@ui/components/buttons/ButtonPrimary';
import GuidedAnswerStatusColumn from './components/StatusColumn/GuidedAnswerStatusColumn';
import { useSourceApi } from '../../hooks/useSourceApi';
import { Column, EmptyState, EmptyStateText, tableHeaderStyle, textHeaderStyle } from './aiSources.styles.js';
import SourceMenuColumn from './components/SourceMenuColumn/SourceMenuColumn';
import LanguageColumn from './components/LanguageColumn/LanguageColumn';
import RemoveSourceDialog from '../RemoveSourceDialog/RemoveSourceDialog';
import AnswerColumn from './components/SourceColumn/AnswerColumn';
import { EditAnswerDialog } from '../GuidedAnswer/EditAnswerDialog';
import { getGuideTitle, getStepTitle } from '../../helpers/source.helper';
import SourceInUsagePanel from '../SourceInUsagePanel/SourceInUsagePanel';
import { CustomMessageDataProvider } from '../GuidedAnswer/useCustomMessage';
import GuidedAnswerBPAStatusColumn from './components/StatusColumn/GuidedAnswerBPAStatusColumn';

const columnWidthMap = {
  name: '50%',
  status: '15%',
  elementsCount: '10%',
  languages: '10%',
  lastRefreshed: '15%',
};

const type = AI_SOURCE.guidedAnswer;

interface GuidedAnswerStatusCellProps {
  source: AiSourceModel.GuidedAnswer;
}

const GuidedAnswerStatusCell = ({ source }: GuidedAnswerStatusCellProps) => {
  const isIntentProcessingMock = useIsIntentProcessingMock(source.searchSourceId);
  const isIntentMode = source.properties.matchingMode === GUIDED_ANSWER_MATCHING_MODE.INTENT;

  if (isIntentMode) {
    return (
      <GuidedAnswerBPAStatusColumn
        status={isIntentProcessingMock ? AI_SOURCE_STATUS.IN_PROGRESS : AI_SOURCE_STATUS.COMPLETED}
        active={!!source.enabled}
      />
    );
  }
  if (source.properties.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.BPA) {
    return <GuidedAnswerBPAStatusColumn status={source.status} active={!!source.enabled} />;
  }
  return <GuidedAnswerStatusColumn status={source.status} active={!!source.enabled} />;
};

interface GuidedAnswerTableProps {
  teamId: number;
  answerList: AiSourceModel.GuidedAnswer[];
  loadAnswers: () => void;
  isLoading: boolean;
  setSortingOrder: (sortField: typeof AI_SOURCE_SORT_KEY, sortDirection: string) => void;
  searchString: string;
  addAnswer: () => void;
  defaultLanguage: string;
}

export const GuidedAnswerTable = ({
  teamId,
  answerList = [],
  loadAnswers,
  isLoading,
  setSortingOrder,
  searchString,
  addAnswer,
  defaultLanguage,
}: GuidedAnswerTableProps) => {
  const [sourceToEditModalData, setSourceToEditModalData] = useState<AiSourceModel.GuidedAnswer | null>(null);
  const [sourceToRemoveModalData, setSourceToRemoveModalData] = useState<AiSourceModel.GuidedAnswer | null>(null);
  const [sourceToShowUsedInPanelData, setSourceToShowUsedInPanelData] = useState<AiSourceModel.GuidedAnswer | null>(
    null
  );

  const hasAnswers = answerList.length > 0;

  const { t } = useTranslation();

  const { removeSource, toggleSource, updateGuidedAnswer } = useSourceApi({ loadSources: loadAnswers, teamId });

  const getNameCellFormatter = (source: AiSourceModel.GuidedAnswer) => (
    <AnswerColumn source={source} defaultLanguage={defaultLanguage} />
  );
  const getStatusCellFormatter = (source: AiSourceModel.GuidedAnswer) => <GuidedAnswerStatusCell source={source} />;

  const getElementsCountCellFormatter = (source: AiSourceModel.GuidedAnswer) => (
    <Column data-cy="elementsCount">
      {source.properties.matchingMode === GUIDED_ANSWER_MATCHING_MODE.INTENT
        ? t('AiSources.GuidedAnswers.IntentLabel')
        : source.elementsCount ?? 0}
    </Column>
  );
  const getLastRefreshedCellFormatter = (source: AiSourceModel.GuidedAnswer) => (
    <Column data-cy="lastRefreshed">{source.updateDate ? displayDate(source.updateDate) : ''}</Column>
  );
  const getLanguagesCellFormatter = (source: AiSourceModel.GuidedAnswer) => (
    <LanguageColumn languageList={source.languageList} />
  );

  const getOptionsCellFormatter = (source: AiSourceModel.GuidedAnswer) => (
    <SourceMenuColumn
      source={source}
      editSource={setSourceToEditModalData}
      removeSource={setSourceToRemoveModalData}
      toggleSource={() => toggleSource({ searchSourceId: source.searchSourceId, enabled: !source.enabled, type })}
      viewUsedIn={setSourceToShowUsedInPanelData}
    />
  );
  const columns = useMemo(
    () => [
      {
        name: t('AiSources.Name'),
        sortable: hasAnswers,
        sortField: AI_SOURCE_SORT_KEY.name,
        cellFormatter: getNameCellFormatter,
        style: { width: columnWidthMap.name, ...tableHeaderStyle, ...textHeaderStyle },
      },
      {
        name: t('AiSources.Status'),
        sortable: hasAnswers,
        sortField: AI_SOURCE_SORT_KEY.status,
        cellFormatter: getStatusCellFormatter,
        style: { width: columnWidthMap.status, ...tableHeaderStyle },
      },
      {
        name: t('AiSources.GuidedAnswers.Queries'),
        sortable: hasAnswers,
        sortField: AI_SOURCE_SORT_KEY.elementsCount,
        cellFormatter: getElementsCountCellFormatter,
        style: { width: columnWidthMap.elementsCount, ...tableHeaderStyle },
      },
      {
        name: t('AiSources.Languages'),
        sortable: hasAnswers,
        sortField: AI_SOURCE_SORT_KEY.languages,
        cellFormatter: getLanguagesCellFormatter,
        style: { width: columnWidthMap.languages, ...tableHeaderStyle },
      },
      {
        name: t('Global.LastModified'),
        sortable: hasAnswers,
        sortField: AI_SOURCE_SORT_KEY.lastRefreshed,
        cellFormatter: getLastRefreshedCellFormatter,
        style: { width: columnWidthMap.lastRefreshed, ...tableHeaderStyle },
      },
      {
        name: '',
        cellFormatter: getOptionsCellFormatter,
        style: tableHeaderStyle,
      },
    ],
    [hasAnswers]
  );

  const handleCloseEditAnswerDialog = () => {
    setSourceToEditModalData(null);
  };

  if (isLoading) {
    return <StyledLoader text={t('Global.Loading')} monochrome />;
  }

  return (
    <>
      <Table columns={columns} rows={answerList} customSort={setSortingOrder} borderless />
      {searchString && !hasAnswers && (
        <SearchEmptyWrap>
          <SearchEmptyIcon />
          <SearchEmptyText>{t('Search.SearchNoResults')}</SearchEmptyText>
        </SearchEmptyWrap>
      )}
      {!searchString && !hasAnswers && (
        <EmptyState>
          <EmptyGuidedAnswerSVG />
          <EmptyStateText data-cy="noAnswersAddedText">{t('AiSources.GuidedAnswers.NoAnswers')}</EmptyStateText>
          <ButtonPrimary data-cy="addFirstAnswerButton" onClick={addAnswer}>
            {t('AiSources.GuidedAnswers.AddFirst')}
          </ButtonPrimary>
        </EmptyState>
      )}
      {!!sourceToRemoveModalData && (
        <RemoveSourceDialog
          source={sourceToRemoveModalData}
          onDelete={() => removeSource({ searchSourceId: sourceToRemoveModalData.searchSourceId, type })}
          onClose={() => setSourceToRemoveModalData(null)}
          teamId={teamId}
        />
      )}
      {!!sourceToEditModalData && (
        <CustomMessageDataProvider initialCustomMessageMap={sourceToEditModalData.properties.customMessage}>
          <EditAnswerDialog
            source={{
              searchSourceId: sourceToEditModalData.searchSourceId,
              name: sourceToEditModalData.name,
              properties: sourceToEditModalData.properties,
              elementsCount: sourceToEditModalData.elementsCount,
              guideLanguageList: sourceToEditModalData.guideLanguageList,
              guideTitle:
                getGuideTitle({ guideTitle: sourceToEditModalData?.guideTitle, language: defaultLanguage }) || '',
              stepName: getStepTitle({ stepTitle: sourceToEditModalData?.stepTitle, language: defaultLanguage }),
            }}
            onSubmit={updateGuidedAnswer}
            onPostSubmit={handleCloseEditAnswerDialog}
            onCancel={handleCloseEditAnswerDialog}
            teamId={teamId}
            customMessage={sourceToEditModalData.properties.customMessage || {}}
          />
        </CustomMessageDataProvider>
      )}
      <SourceInUsagePanel
        show={!!sourceToShowUsedInPanelData}
        source={sourceToShowUsedInPanelData}
        toggleComponent={() => setSourceToShowUsedInPanelData(null)}
        teamId={teamId}
      />
    </>
  );
};
