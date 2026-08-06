import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AI_SOURCE, AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS } from 'stonly-editor/model/aiSource/aiSource.enum';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import { ColumnFlex } from '@ui/components/Flex';
import { defaultScrollStyles } from '@editorCommon/CommonStyledComponents/CustomScrollbar.jsx';
import useUserManagement from '@editorCommon/hooks/useUserManagement';
import {
  FiltersSection,
  StyledCard,
  StyledTableHeader,
  StyledDivider,
  StyledTitle,
} from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/sections/aiSources.styles.js';
import { getStatusOptions } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/helpers/source.helper';
import SettingPicker from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/Team/_shared/SettingPicker/SettingPicker';
import LanguagePicker from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/components/LanguagePicker/LanguagePicker';
import {
  PAGINATION_LIMIT,
  useFetchSource,
} from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/hooks/useFetchSource';
import { useSourceApi } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/hooks/useSourceApi';
import { useSaveAiAutomationTab } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/hooks/aiAutomationTab';
import { GuidedAnswerTypePicker } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/GuidedAnswers/GuidedAnswerTypePicker';
import { CustomMessageDataProvider } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/components/GuidedAnswer/useCustomMessage';
import { GuidedAnswerTable } from './GuidedAnswerTable';
import { AddAnswerDialog } from './AddAnswerDialog';

/** V2 layout fork — diverges from the shared GuidedAnswers screen; edit files under versions/v2/guidedAnswer when iterating. */

const Wrap = styled(ColumnFlex).attrs({
  flexShrink: 0,
  flexGrow: 1,
  paddingX: 3,
})`
  overflow-y: auto;
  ${defaultScrollStyles};
`;

interface GuidedAnswersProps {
  teamId: number;
}

export const GuidedAnswers = ({ teamId }: GuidedAnswersProps) => {
  const [isAddSourceDialogOpen, setIsAddSourceDialogOpen] = useState(false);
  const [selectedStatusList, setSelectedStatusList] = useState([]);
  const [selectedLanguageList, setSelectedLanguageList] = useState([]);
  const [selectedGuideLaunchModeList, setSelectedGuideLaunchModeList] = useState([]);
  const type = AI_SOURCE.guidedAnswer;
  const { t } = useTranslation();
  const settingsWrapRef = useRef();

  const userManagement = useUserManagement();

  const defaultLanguage = useMemo(() => {
    const { defaultLanguage } = userManagement?.user;
    return AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS.find(language => language === defaultLanguage) || 'en';
  }, [userManagement]);

  useSaveAiAutomationTab('guidedAnswers');

  const {
    setSourceSortingOrder,
    isLoading,
    sourceList: answerList,
    page,
    setPage,
    itemsCount,
    existsNext,
    loadSources,
    orderDirection,
    orderBy,
    searchValue,
    onSearchValueChange,
  } = useFetchSource({
    teamId,
    type,
    enableSearch: true,
    selectedLanguageList,
    selectedStatusList,
    guideLaunchModeList: selectedGuideLaunchModeList,
  });

  const { createGuidedAnswer } = useSourceApi({ teamId, loadSources });

  const addAnswer = () => setIsAddSourceDialogOpen(true);

  const handleCloseAddSourceDialog = () => {
    setIsAddSourceDialogOpen(false);
  };

  return (
    <Wrap ref={settingsWrapRef}>
      <StyledTitle>
        <span data-stonly-trigger="guided-answers-settings-title">{t('AiSources.GuidedAnswers.Answers')}</span>
        <FiltersSection>
          <GuidedAnswerTypePicker
            teamId={teamId}
            selectedGuideLaunchModeList={selectedGuideLaunchModeList}
            setSelectedGuideLaunchModeList={setSelectedGuideLaunchModeList}
          />
          <SettingPicker
            selectedOptions={selectedStatusList}
            setSelectedOptions={setSelectedStatusList}
            defaultLabel={t('AiSources.StatusAny')}
            options={getStatusOptions().map(option => ({
              ...option,
              label: t(option.label),
            }))}
          />
          <LanguagePicker
            selectedLanguages={selectedLanguageList}
            setSelectedLanguages={setSelectedLanguageList}
            languageList={AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS}
          />
        </FiltersSection>
      </StyledTitle>
      <StyledCard>
        <StyledTableHeader
          itemsCount={itemsCount}
          addText={t('AiSources.GuidedAnswers.AddNew')}
          onAddItemClick={addAnswer}
          page={page}
          changePage={setPage}
          existsNext={existsNext}
          searchString={searchValue}
          searchPlaceholder={t('Global.Search')}
          onSearchStringChange={onSearchValueChange}
          paginationLimit={PAGINATION_LIMIT}
          addItemDataCy="addGuidedAnswer"
        />
        <StyledDivider scrollableElementRef={settingsWrapRef} scrollTop={110} />
        <GuidedAnswerTable
          teamId={teamId}
          answerList={answerList as AiSourceModel.GuidedAnswer[]}
          loadAnswers={loadSources}
          isLoading={isLoading}
          setSortingOrder={setSourceSortingOrder}
          searchString={searchValue}
          addAnswer={addAnswer}
          orderDirection={orderDirection}
          orderBy={orderBy}
          defaultLanguage={defaultLanguage}
        />
      </StyledCard>
      {isAddSourceDialogOpen && (
        <CustomMessageDataProvider>
          <AddAnswerDialog
            onSubmit={createGuidedAnswer}
            onCancel={handleCloseAddSourceDialog}
            onPostSubmit={handleCloseAddSourceDialog}
            teamId={teamId}
            defaultLanguage={defaultLanguage}
          />
        </CustomMessageDataProvider>
      )}
    </Wrap>
  );
};
