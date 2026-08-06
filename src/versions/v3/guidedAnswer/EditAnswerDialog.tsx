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
  GUIDED_ANSWER_START,
  type GuidedAnswerLaunchModeType,
  type GuidedAnswerStartType,
} from 'stonly-editor/model/aiSource/aiSource.enum';
import { queryClient } from 'stonly-editor/Site/SiteRootProviders/QueryClientProvider';
import { Notification } from '@ui/components/notifications';
import {
  type AnswerProperties,
  AnswerSettings,
} from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/components/GuidedAnswer/components/AnswerSettings';
import { AdvancedSettings } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/components/GuidedAnswer/components/AdvancedSettings';
import { markIntentProcessingMock } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/components/GuidedAnswer/useIntentProcessingMock';
import { useCustomMessage } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/components/GuidedAnswer/useCustomMessage';
import { type QueriesByLanguage, QueriesSettings, QUERY_LIMIT, QUERY_MAX_LENGTH } from './components/QueriesSettings';

/** V3 layout fork (from V2) — "Generate queries" now lives inside QueriesSettings (next to
 * "+ Add query") instead of a separate panel above it — see GenerateQueriesDropdown. Edit files
 * under versions/v3/guidedAnswer when iterating. */

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
  // Maps id -> the original generated text, for any query that was ever AI-generated (kept even
  // after the row is edited away from AI, so the "revert" control can restore it).
  const [aiOriginalTextById, setAiOriginalTextById] = useState<{ [id: string]: string }>({});
  const [wasQueryTipDisplayed, setWasQueryTipDisplayed] = useLocalStorage('guidedAiAnswerQueryTipShown', false);
  // Modal Button Guidelines: Save is never disabled — clicking while incomplete triggers inline
  // validation across the relevant tab(s) instead.
  const [isValidationTriggered, setIsValidationTriggered] = useState(false);
  // Persisted onto properties.intentDescription on save, so it's back when reopening this answer.
  const [intentDescription, setIntentDescription] = useState(source.properties.intentDescription || '');

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
          // Keep unsaved additions (uuid keys, e.g. from the generate panel) when the fetch lands
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
      // This mock has no persisted "was AI-generated" flag on a saved query, so a freshly-loaded
      // row has no way to prove its origin — but QueriesSettings still needs to default it to
      // something. Defaulting to AI (seeding each loaded id's own text as its "original") means it
      // shows the AI icon until a human actually edits it, at which point it correctly flips to
      // manual — instead of every persisted row showing as manual from the moment this dialog
      // opens, regardless of how it was actually created.
      setAiOriginalTextById(previous => {
        const seeded = { ...previous };
        Object.entries(newQueries).forEach(([id, query]) => {
          if (!(id in seeded)) {
            seeded[id] = query;
          }
        });
        return seeded;
      });
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

    const updated: (AiSourceDto.GuidedAnswerQuery & { searchSourceElementId: number })[] = [];
    const added: AiSourceDto.GuidedAnswerQuery[] = [];
    const removed: number[] = [
      ...queryIdListToDelete,
      ...Object.values(draftQueriesByLanguage)
        .flatMap(queries => Object.keys(queries))
        .filter(id => !isUuidV4(id))
        .map(id => +id),
    ];

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
        intentDescription: intentDescription.trim() || undefined,
      },
      queries: {
        added,
        updated,
        removed,
      },
    };
    await onSubmit(guidedAnswerToEdit);
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
          draft[language] = draftQueriesByLanguage[language] || {};
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
    // Keep viewing the current language when possible; otherwise land on the newly added one so
    // its "pending sync" banner (see QueriesSettings) is immediately visible.
    const nextCurrentLanguage = updatedQueriesByLanguage[currentLanguage]
      ? currentLanguage
      : Object.keys(updatedQueriesByLanguage)[0];
    setCurrentLanguage(nextCurrentLanguage);
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
    idsToRemove,
  }: {
    queriesByLanguage: QueriesByLanguage;
    counterDiff: number;
    idsToRemove?: string[];
  }) => {
    setQueriesByLanguage(updatedQueriesByLanguage);
    setCounter(prev => +prev + counterDiff);
    setHasChanged(true);
    if (idsToRemove?.length) {
      const persistedIdsToDelete = idsToRemove.filter(id => !isUuidV4(id)).map(id => +id);
      if (persistedIdsToDelete.length) {
        setQueryIdListToDelete(prev => [...prev, ...persistedIdsToDelete]);
      }
      setAiOriginalTextById(previous =>
        produce(previous, draft => {
          idsToRemove.forEach(id => delete draft[id]);
        })
      );
    }
  };

  const hasQueriesError = useMemo(() => {
    const queryList = Object.values(queriesByLanguage).flatMap(queryById =>
      Object.values(queryById).map(query => query)
    );
    return queryList.some(query => query.length > QUERY_MAX_LENGTH);
  }, [queriesByLanguage]);

  // V2 direct insertion: generated queries are merged straight into the assigned list, and their
  // original text is stored so QueriesSettings can show the AI sparkle (or, once edited away from
  // that original, a "revert to AI-generated" control).
  const onAddGeneratedQueries = (queryTextListByLanguage: { [language: string]: string[] }) => {
    let addedCount = 0;
    const newOriginalTextById: { [id: string]: string } = {};
    setQueriesByLanguage(
      produce(queriesByLanguage, draft => {
        Object.entries(queryTextListByLanguage).forEach(([language, queryTextList]) => {
          if (!draft[language]) {
            draft[language] = {};
          }
          queryTextList.forEach(queryText => {
            const id = uuidv4();
            draft[language][id] = queryText;
            newOriginalTextById[id] = queryText;
            addedCount += 1;
          });
        });
      })
    );
    setAiOriginalTextById(previous => ({ ...previous, ...newOriginalTextById }));
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
      label: `${t('AiSources.GuidedAnswers.Queries')} (${counter})`,
      content:
        isQueryLoading || isPending ? (
          <ColumnFlex padding={4}>
            <Loader />
          </ColumnFlex>
        ) : (
          <ColumnFlex gap={3} padding={4} paddingBottom={6}>
            {!wasQueryTipDisplayed && (
              <Notification
                severity="info"
                data-cy="guidedAiAnswerQueryTip"
                onCloseClick={() => setWasQueryTipDisplayed(true)}
              >
                {t('AiSources.GuidedAnswers.V3.QueryTip')}
              </Notification>
            )}
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
              aiOriginalTextById={aiOriginalTextById}
              isCustomMessageType={isCustomMessageType}
              intentDescription={intentDescription}
              onIntentDescriptionChange={value => {
                setIntentDescription(value);
                setHasChanged(true);
              }}
              onAddGeneratedQueries={onAddGeneratedQueries}
            />
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

  const hasEmptyFields = !name.trim() || (!isCustomMessageType && !answerProperties.guideId) || counter === 0;
  const hasErrorFields = hasQueriesError || (isCustomMessageType && hasCustomMessagesError);
  // Name edits aren't tracked by hasChanged (see onCancelProxy) — combine both for "any changes".
  const hasAnyChanges = name !== source.name || hasChanged;

  return (
    <>
      <ModalWindow>
        <ActionsDialog
          data-cy="editGuidedAnswerDialog"
          size="large"
          title={t('AiSources.GuidedAnswers.V2.EditAnswerTitleWithName', { name: source.name })}
          primaryAction={onSubmitProxy}
          primaryLabel={t('AiSources.GuidedAnswers.V2.SaveChangesButton')}
          secondaryAction={onCancelProxy}
          secondaryLabel={hasAnyChanges ? t('Global.DiscardChanges') : t('Global.Cancel')}
          primaryIsLoading={isSubmitLoading}
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
