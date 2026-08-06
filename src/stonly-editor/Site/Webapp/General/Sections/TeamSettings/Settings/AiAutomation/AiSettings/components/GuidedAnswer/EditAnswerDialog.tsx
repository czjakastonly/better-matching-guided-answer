import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import produce from 'immer';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { type AiSourceDto } from 'stonly-editor/api/aiSource/aiSource.dto';
import { AiSourceApi } from 'stonly-editor/api/aiSource/aiSource.api';
import Tabs from '@editorCommon/CustomElements/Tabs';
import Loader from '@editorCommon/CustomElements/Loader';
import { ColumnFlex } from '@ui/components/Flex';
import useLocalStorage from '@editorCommon/hooks/useLocalStorageValue';
import { ActionsDialog } from '@ui/components/dialogs/ActionsDialog';
import { ModalWindow } from '@ui/components/ModalWindow';
import { isUuidV4, uuidv4 } from '@stonlyCommons/helpers/randomValues';
import {
  GUIDED_ANSWER_LAUNCH_MODE,
  GUIDED_ANSWER_MATCHING_MODE,
  GUIDED_ANSWER_START,
  type GuidedAnswerLaunchModeType,
  type GuidedAnswerMatchingModeType,
  type GuidedAnswerStartType,
} from 'stonly-editor/model/aiSource/aiSource.enum';
import { queryClient } from 'stonly-editor/Site/SiteRootProviders/QueryClientProvider';
import { Notification } from '@ui/components/notifications';
import { type AnswerProperties, AnswerSettings } from './components/AnswerSettings';
import { type QueriesByLanguage, QueriesSettings, QUERY_LIMIT, QUERY_MAX_LENGTH } from './components/QueriesSettings';
import { AdvancedSettings } from './components/AdvancedSettings';
import { MatchingModeSelect } from './components/MatchingModeSelect';
import {
  IntentSettings,
  INTENT_DESCRIPTION_MIN_LENGTH,
  INTENT_DESCRIPTION_MIN_LENGTH_CUSTOM_MESSAGE,
  isIntentDescriptionValid,
} from './components/IntentSettings';
import { GenerateQueriesPanel } from './components/GenerateQueriesPanel';
import { GA_PROTOTYPE_VARIANT, getGaPrototypeVariant } from './gaPrototypeVariant';
import { markIntentProcessingMock } from './useIntentProcessingMock';
import { useCustomMessage } from './useCustomMessage';

export const StyledTabs = styled(Tabs)`
  margin-bottom: 0;
  & .tabSwitcher {
    margin-bottom: 0;
  }
  .tabSwitcher > :first-child {
    margin-left: 32px;
  }
`;

const TAB_ID = {
  ANSWER: 'answer',
  QUERIES: 'queries',
  SETTINGS: 'settings',
} as const;

type TabIdType = (typeof TAB_ID)[keyof typeof TAB_ID];

interface SourceDetails {
  searchSourceId: number;
  name: string;
  properties: {
    guideId?: string | null;
    startFromStepId?: number;
    stepStartType?: GuidedAnswerStartType;
    customLoadingMessage?: { [key: string]: string | undefined };
    customMessage?: { [key: string]: string };
    guideLaunchMode: GuidedAnswerLaunchModeType;
    matchingMode?: GuidedAnswerMatchingModeType;
    intentDescription?: string;
  };
  elementsCount: number;
  guideLanguageList: string[];
  guideTitle: string;
  stepName?: string;
  customMessage?: { [key: string]: string };
}

export interface EditAnswerDialogProps {
  source: SourceDetails;
  onCancel: () => void;
  onSubmit: (data: Omit<AiSourceDto.UpdateGuidedAnswer, 'teamId'>) => Promise<void>;
  onPostSubmit: () => void;
  teamId: number;
}

const setInitialStepStartType = (stepStartType?: GuidedAnswerStartType, startFromStepId?: number) => {
  if (stepStartType === GUIDED_ANSWER_START.SPECIFIC_STEP && !startFromStepId) {
    return undefined;
  }
  return stepStartType;
};

export const EditAnswerDialog = ({ onCancel, onSubmit, onPostSubmit, teamId, source }: EditAnswerDialogProps) => {
  const [name, setName] = useState(source.name);
  const [answerProperties, setAnswerProperties] = useState<AnswerProperties>({
    guideId: source.properties.guideId || undefined,
    startFromStepId: source.properties.startFromStepId || undefined,
    stepStartType: setInitialStepStartType(source.properties.stepStartType, source.properties.startFromStepId),
    guideTitle: source.guideTitle,
    stepName: source.stepName || '',
    guideLanguageList: source.guideLanguageList || [],
    customLoadingMessage: source.properties.customLoadingMessage
      ? { ...source.properties.customLoadingMessage }
      : undefined,
    customMessage: source.properties.customMessage ? { ...source.properties.customMessage } : undefined,
    guideLaunchMode: source.properties.guideLaunchMode,
    isBpaEnabled: source.properties.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.BPA,
  });
  const [queriesByLanguage, setQueriesByLanguage] = useState<QueriesByLanguage>({});
  const [initQueriesByLanguage, setInitQueriesByLanguage] = useState<QueriesByLanguage>({});
  const [draftQueriesByLanguage, setDraftQueriesByLanguage] = useState<QueriesByLanguage>({});
  const [queryIdListToDelete, setQueryIdListToDelete] = useState<number[]>([]);
  const initialMatchingMode = source.properties.matchingMode || GUIDED_ANSWER_MATCHING_MODE.QUERIES;
  const [matchingMode, setMatchingMode] = useState<GuidedAnswerMatchingModeType>(initialMatchingMode);
  const [intentDescription, setIntentDescription] = useState(source.properties.intentDescription || '');
  // Prototype switch (localStorage, see gaPrototypeVariant.ts): V4 = intent-first generation, V3 = matching modes
  const isV4Prototype = getGaPrototypeVariant() === GA_PROTOTYPE_VARIANT.V4;
  const [wasQueryTipDisplayed, setWasQueryTipDisplayed] = useLocalStorage('guidedAiAnswerQueryTipShown', false);
  const isIntentMode = !isV4Prototype && matchingMode === GUIDED_ANSWER_MATCHING_MODE.INTENT;

  const isCustomMessageType = answerProperties.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE;
  const isBpaMode = answerProperties.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.BPA;
  const [customLoadingMessage, setCustomLoadingMessage] = useState<{ [key: string]: string }>(
    source.properties.customLoadingMessage
  );

  const {
    setCustomMessageMap,
    customMessageLanguageList,
    hasCustomMessagesError,
    validateCustomMessage,
    getCustomMessageByLanguage,
  } = useCustomMessage();

  const languageList = useMemo(() => {
    return isCustomMessageType ? customMessageLanguageList : answerProperties.guideLanguageList;
  }, [isCustomMessageType, customMessageLanguageList, answerProperties.guideLanguageList]);

  const [hasChanged, setHasChanged] = useState(false);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [counter, setCounter] = useState<number>(source.elementsCount || 0);
  const [currentLanguage, setCurrentLanguage] = useState<string>(languageList[0]);
  const [activeTabId, setActiveTabId] = useState<TabIdType>(TAB_ID.ANSWER);
  const [isExitPopupOpen, setIsExitPopupOpen] = useState(false);
  // Modal Button Guidelines: Save is never disabled — clicking while incomplete triggers inline
  // validation across the relevant tab(s) instead.
  const [isValidationTriggered, setIsValidationTriggered] = useState(false);

  const { t } = useTranslation();

  const {
    data: { items: queryDataList } = { items: [] },
    isFetched,
    isFetching: isQueryLoading,
  } = useQuery({
    placeholderData: { items: [] },
    queryKey: [
      ...AiSourceApi.getSourceElementsByIdQueryKey({
        teamId,
        searchSourceId: source.searchSourceId,
      }),
      currentLanguage,
    ],
    queryFn: () =>
      AiSourceApi.getSourceElementsById({
        teamId,
        searchSourceId: source.searchSourceId,
        language: currentLanguage,
        limit: QUERY_LIMIT,
      }),
    enabled: !!teamId && !!source.searchSourceId && !!currentLanguage?.length,
    onError: error => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (isFetched) {
      const newQueries = Object.fromEntries(
        queryDataList.map(({ searchSourceElementId, name: query }) => [searchSourceElementId, query])
      );
      setQueriesByLanguage(
        produce(queriesByLanguage, draft => {
          // Keep unsaved additions (uuid keys, e.g. from the V4 generate panel) when the fetch lands
          const unsavedQueries = Object.fromEntries(
            Object.entries(draft[currentLanguage] || {}).filter(([id]) => isUuidV4(id))
          );
          draft[currentLanguage] = { ...newQueries, ...unsavedQueries };
        })
      );
      setInitQueriesByLanguage(
        produce(initQueriesByLanguage, draft => {
          draft[currentLanguage] = newQueries;
        })
      );
    }
  }, [isFetched, queryDataList, currentLanguage]);

  const onSubmitProxy = async () => {
    if (isPending) return;
    if (hasEmptyFields || hasErrorFields) {
      setIsValidationTriggered(true);
      if (isCustomMessageType) {
        validateCustomMessage();
      }
      return;
    }
    const { guideId, startFromStepId, stepStartType, guideLaunchMode } = answerProperties;
    if (!guideLaunchMode) return;
    const isMissingGuideSetup = !guideId || (!isBpaMode && !stepStartType);
    if (!isCustomMessageType && isMissingGuideSetup) return;

    setIsSubmitLoading(true);

    // Prepare queries changes (Intent mode: prototype sends no query mutations, queries are generated server-side)
    const updated: (AiSourceDto.GuidedAnswerQuery & { searchSourceElementId: number })[] = [];
    const added: AiSourceDto.GuidedAnswerQuery[] = [];
    const removed: number[] = isIntentMode
      ? []
      : [
          ...queryIdListToDelete,
          ...Object.values(draftQueriesByLanguage)
            .flatMap(queries => Object.keys(queries))
            .filter(id => !isUuidV4(id))
            .map(id => +id),
        ];

    if (!isIntentMode) {
      Object.keys(queriesByLanguage).forEach(language => {
        Object.entries(queriesByLanguage[language]).forEach(([id, query]) => {
          if (isUuidV4(id)) {
            const trimmedQuery = query.trim();
            if (trimmedQuery) {
              added.push({ query: trimmedQuery, language });
            }
          } else if (query !== initQueriesByLanguage[language][id]) {
            updated.push({ query, searchSourceElementId: +id, language });
          }
        });
      });
    }

    const guidedAnswerToEdit: Omit<AiSourceDto.UpdateGuidedAnswer, 'teamId'> = {
      searchSourceId: source.searchSourceId,
      name: name.trim(),
      properties: {
        guideId,
        startFromStepId,
        stepStartType,
        customLoadingMessage: isCustomMessageType ? undefined : customLoadingMessage,
        guideLaunchMode,
        customMessage: isCustomMessageType ? getCustomMessageByLanguage() : undefined,
        matchingMode: isV4Prototype ? undefined : matchingMode,
        intentDescription: isIntentMode ? intentDescription.trim() : undefined,
      },
      queries: {
        added,
        updated,
        removed,
      },
    };
    await onSubmit(guidedAnswerToEdit);
    if (isIntentMode) {
      markIntentProcessingMock(source.searchSourceId);
    }
    queryClient.invalidateQueries({
      queryKey: AiSourceApi.getSourceElementsByIdQueryKey({
        teamId,
        searchSourceId: source.searchSourceId,
      }),
    });
    setIsSubmitLoading(false);
    onPostSubmit();
  };

  const updateQueriesBasedOnLanguageList = async (newLanguageList: string[], previousLanguageList: string[]) => {
    setIsPending(true);
    const languageListToAdd = newLanguageList.filter(language => !previousLanguageList.includes(language));
    const languageListToRemove = previousLanguageList.filter(language => !newLanguageList.includes(language));

    if (languageListToAdd.length === 0 && languageListToRemove.length === 0) {
      return;
    }

    const loadedLanguageList = Object.keys(queriesByLanguage);
    const languageListToFetchAndRemove = languageListToRemove.filter(
      language => !loadedLanguageList.includes(language)
    );
    const updatedQueriesByLanguage = produce(queriesByLanguage, draft => {
      languageListToAdd.forEach(language => {
        if (!draft[language]) {
          draft[language] = draftQueriesByLanguage[language] || { [uuidv4()]: '' };
        }
      });
      languageListToRemove.forEach(language => {
        delete draft[language];
      });
    });

    const dataToRemove = await Promise.all(
      languageListToFetchAndRemove.map(language =>
        AiSourceApi.getSourceElementsById({
          teamId,
          searchSourceId: source.searchSourceId,
          language,
        }).then(({ items }) => {
          return {
            language,
            queries: Object.fromEntries(
              items.map(({ searchSourceElementId, name: query }) => [searchSourceElementId, query])
            ),
          };
        })
      )
    );
    const updatedDraftQueriesByLanguage = produce(draftQueriesByLanguage, draft => {
      languageListToAdd.forEach(language => {
        delete draft[language];
      });
      languageListToRemove
        .filter(language => !languageListToFetchAndRemove.includes(language))
        .forEach(language => {
          draft[language] = queriesByLanguage[language];
        });
      dataToRemove.forEach(({ language, queries }) => {
        draft[language] = queries;
      });
    });

    let addCounter = 0;
    let removeCounter = 0;
    languageListToAdd.forEach(language => {
      addCounter += Object.keys(draftQueriesByLanguage[language] || {}).length;
    });
    languageListToRemove.forEach(language => {
      removeCounter += Object.keys(updatedDraftQueriesByLanguage[language] || {}).length;
    });
    setCurrentLanguage(Object.keys(updatedQueriesByLanguage)[0]);
    setCounter(prev => +prev + addCounter - removeCounter);
    setQueriesByLanguage(updatedQueriesByLanguage);
    setDraftQueriesByLanguage(updatedDraftQueriesByLanguage);
    setIsPending(false);
  };

  const onAnswerGuidePropertiesChange = async (data: AnswerProperties) => {
    setHasChanged(true);
    setIsPending(true);
    if (data.guideLaunchMode !== GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE) {
      await updateQueriesBasedOnLanguageList(data.guideLanguageList, answerProperties.guideLanguageList);
    } else if (
      answerProperties.guideLaunchMode !== GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE &&
      !answerProperties.customMessage
    ) {
      setCustomMessageMap(
        Object.fromEntries(answerProperties.guideLanguageList.map(language => [uuidv4(), { language, message: '' }]))
      );
    }
    setIsPending(false);
    setAnswerProperties(data);
  };

  const onQueriesChange = ({
    queriesByLanguage: updatedQueriesByLanguage,
    counterDiff,
    idToRemove,
  }: {
    queriesByLanguage: QueriesByLanguage;
    counterDiff: number;
    idToRemove?: string;
  }) => {
    setQueriesByLanguage(updatedQueriesByLanguage);
    setCounter(prev => +prev + counterDiff);
    setHasChanged(true);
    if (idToRemove && !isUuidV4(idToRemove)) {
      setQueryIdListToDelete(prev => [...prev, +idToRemove]);
    }
  };

  const hasQueriesError = useMemo(() => {
    const queryList = Object.values(queriesByLanguage).flatMap(queryById =>
      Object.values(queryById).map(query => query)
    );
    return queryList.some(query => query.length > QUERY_MAX_LENGTH);
  }, [queriesByLanguage]);

  const intentMinLength = isCustomMessageType
    ? INTENT_DESCRIPTION_MIN_LENGTH_CUSTOM_MESSAGE
    : INTENT_DESCRIPTION_MIN_LENGTH;

  const onMatchingModeChange = (newMatchingMode: GuidedAnswerMatchingModeType) => {
    setMatchingMode(newMatchingMode);
    setHasChanged(true);
  };

  const onIntentDescriptionChange = (newIntentDescription: string) => {
    setIntentDescription(newIntentDescription);
    setHasChanged(true);
  };

  // V4 prototype: approved suggestions from the generate panel become plain queries
  const onAddGeneratedQueries = (queryTextListByLanguage: { [language: string]: string[] }) => {
    let addedCount = 0;
    setQueriesByLanguage(
      produce(queriesByLanguage, draft => {
        Object.entries(queryTextListByLanguage).forEach(([language, queryTextList]) => {
          if (!draft[language]) {
            draft[language] = {};
          }
          queryTextList.forEach(queryText => {
            draft[language][uuidv4()] = queryText;
            addedCount += 1;
          });
        });
      })
    );
    setCounter(prev => +prev + addedCount);
    setHasChanged(true);
  };

  const onCancelProxy = () => {
    if (name !== source.name || hasChanged) {
      setIsExitPopupOpen(true);
    } else {
      onCancel();
    }
  };

  const tabs = [
    {
      id: TAB_ID.ANSWER,
      label: t('AiSources.GuidedAnswers.Answer'),
      content: (
        <AnswerSettings
          name={name}
          setName={setName}
          properties={answerProperties}
          setProperties={onAnswerGuidePropertiesChange}
          teamId={teamId}
          withPadding
          updateQueriesBasedOnLanguageList={updateQueriesBasedOnLanguageList}
          showValidation={isValidationTriggered}
        />
      ),
    },
    {
      id: TAB_ID.QUERIES,
      disabled: isCustomMessageType && hasCustomMessagesError,
      label: isV4Prototype ? `${t('AiSources.GuidedAnswers.Queries')} (${counter})` : t('AiSources.GuidedAnswers.MatchingMode'),
      content:
        isQueryLoading || isPending ? (
          <ColumnFlex padding={4}>
            <Loader />
          </ColumnFlex>
        ) : isV4Prototype ? (
          <ColumnFlex gap={3} padding={4} paddingBottom={6}>
            {!wasQueryTipDisplayed && (
              <Notification
                severity="info"
                data-cy="guidedAiAnswerQueryTip"
                onCloseClick={() => setWasQueryTipDisplayed(true)}
              >
                {t('AiSources.GuidedAnswers.QueryTip')}
              </Notification>
            )}
            <GenerateQueriesPanel
              languageList={languageList}
              currentLanguage={currentLanguage}
              isCustomMessageType={isCustomMessageType}
              existingQueryList={Object.values(queriesByLanguage[currentLanguage] || {})}
              onAddQueries={onAddGeneratedQueries}
            />
            {isValidationTriggered && counter === 0 && (
              <Notification severity="error" data-cy="queriesRequiredError">
                {t('AiSources.GuidedAnswers.AddQueriesRequiredError')}
              </Notification>
            )}
            <QueriesSettings
              withoutTip
              queriesByLanguage={queriesByLanguage}
              onQueriesChange={onQueriesChange}
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
              languageList={languageList}
              languageSelectMessage={`${t(
                isCustomMessageType
                  ? 'AiSources.GuidedAnswers.SelectLanguageInfoCustomMessage'
                  : 'AiSources.GuidedAnswers.SelectLanguageInfoGuide'
              )}`}
            />
          </ColumnFlex>
        ) : (
          <ColumnFlex gap={3} padding={4} paddingBottom={6}>
            <MatchingModeSelect matchingMode={matchingMode} onMatchingModeChange={onMatchingModeChange} />
            {isIntentMode && initialMatchingMode === GUIDED_ANSWER_MATCHING_MODE.QUERIES && counter > 0 && (
              <Notification severity="warning" data-cy="intentSwitchWarning">
                {t('AiSources.GuidedAnswers.IntentSwitchWarning', { count: counter })}
              </Notification>
            )}
            {!isIntentMode && initialMatchingMode === GUIDED_ANSWER_MATCHING_MODE.INTENT && (
              <Notification severity="warning" data-cy="queriesSwitchWarning">
                {t('AiSources.GuidedAnswers.QueriesSwitchWarning')}
              </Notification>
            )}
            {isIntentMode ? (
              <IntentSettings
                intentDescription={intentDescription}
                onIntentDescriptionChange={onIntentDescriptionChange}
                minLength={intentMinLength}
                showValidation={isValidationTriggered}
              />
            ) : (
              <>
                {isValidationTriggered && counter === 0 && (
                  <Notification severity="error" data-cy="queriesRequiredError">
                    {t('AiSources.GuidedAnswers.AddQueriesRequiredError')}
                  </Notification>
                )}
                <QueriesSettings
                  queriesByLanguage={queriesByLanguage}
                  onQueriesChange={onQueriesChange}
                  currentLanguage={currentLanguage}
                  setCurrentLanguage={setCurrentLanguage}
                  languageList={languageList}
                  languageSelectMessage={`${t(
                    isCustomMessageType
                      ? 'AiSources.GuidedAnswers.SelectLanguageInfoCustomMessage'
                      : 'AiSources.GuidedAnswers.SelectLanguageInfoGuide'
                  )}`}
                />
              </>
            )}
          </ColumnFlex>
        ),
    },
    !isCustomMessageType && {
      id: TAB_ID.SETTINGS,
      label: t('AdminConsole.Settings'),
      content: (
        <AdvancedSettings
          key={currentLanguage}
          customLoadingMessage={customLoadingMessage}
          setCustomLoadingMessage={setCustomLoadingMessage}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          languageList={languageList}
        />
      ),
    },
  ].filter(Boolean);

  const onTabClick = (tabId: TabIdType) => {
    if (tabId === TAB_ID.QUERIES && isCustomMessageType && hasCustomMessagesError) {
      validateCustomMessage();
    }
    setActiveTabId(tabId);
  };

  const hasEmptyFields =
    !name.trim() ||
    (!isCustomMessageType && !answerProperties.guideId) ||
    (isIntentMode ? !isIntentDescriptionValid(intentDescription, intentMinLength) : counter === 0);
  const hasErrorFields = (!isIntentMode && hasQueriesError) || (isCustomMessageType && hasCustomMessagesError);
  // Name edits aren't tracked by hasChanged (see onCancelProxy) — combine both for "any changes".
  const hasAnyChanges = name !== source.name || hasChanged;

  return (
    <>
      <ModalWindow>
        <ActionsDialog
          data-cy="editGuidedAnswerDialog"
          title={t('AiSources.GuidedAnswers.EditAnswerTitle')}
          primaryAction={onSubmitProxy}
          primaryLabel={t('Global.Save')}
          secondaryAction={hasAnyChanges ? onCancel : undefined}
          secondaryLabel={hasAnyChanges ? t('Global.DiscardChanges') : undefined}
          primaryIsLoading={isSubmitLoading}
          closeAction={onCancelProxy}
          contentWrapMode="nopadding"
        >
          <StyledTabs tabs={tabs} onClick={onTabClick} activeTabId={activeTabId} />
        </ActionsDialog>
      </ModalWindow>
      {isExitPopupOpen && (
        <ModalWindow>
          <ActionsDialog
            title={t('AiSources.GuidedAnswers.ExitPopupTitle')}
            primaryLabel={t('Global.DiscardChanges')}
            primaryAction={onCancel}
            secondaryLabel={t('Global.BackToEditing')}
            secondaryAction={() => setIsExitPopupOpen(false)}
            autoFocusMode="secondary"
            size="small"
          >
            {t('AiSources.GuidedAnswers.ExitPopupContent')}
          </ActionsDialog>
        </ModalWindow>
      )}
    </>
  );
};
