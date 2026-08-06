import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import produce from 'immer';
import { ActionsDialog } from '@ui/components/dialogs/ActionsDialog';
import { ModalWindow } from '@ui/components/ModalWindow';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import { type AiSourceDto } from 'stonly-editor/api/aiSource/aiSource.dto';
import { uuidv4 } from '@stonlyCommons/helpers/randomValues';
import { ColumnFlex } from '@ui/components/Flex';
import { Notification } from '@ui/components/notifications';
import useLocalStorage from '@editorCommon/hooks/useLocalStorageValue';
import {
  GUIDED_ANSWER_LAUNCH_MODE,
  GUIDED_ANSWER_MATCHING_MODE,
  type GuidedAnswerMatchingModeType,
} from 'stonly-editor/model/aiSource/aiSource.enum';
import { type AnswerProperties, AnswerSettings } from './components/AnswerSettings';
import { type QueriesByLanguage, QueriesSettings, QUERY_MAX_LENGTH } from './components/QueriesSettings';
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

interface AddAnswerDialogProps {
  onCancel: () => void;
  onSubmit: (values: Omit<AiSourceDto.CreateGuidedAnswer, 'teamId'>) => Promise<void | AiSourceDto.CreatedAiSource>;
  onPostSubmit: () => void;
  teamId: number;
  defaultLanguage: string;
}

export const AddAnswerDialog = ({
  onCancel,
  onSubmit,
  onPostSubmit,
  teamId,
  defaultLanguage,
}: AddAnswerDialogProps) => {
  const [name, setName] = useState('');
  const [answerProperties, setAnswerProperties] = useState<AnswerProperties>({
    guideTitle: '',
    stepName: '',
    guideLanguageList: [],
  });
  const [queriesByLanguage, setQueriesByLanguage] = useState<QueriesByLanguage>({});
  const [draftQueriesByLanguage, setDraftQueriesByLanguage] = useState<QueriesByLanguage>({});

  const [isLoading, setIsLoading] = useState(false);

  const [isNextStep, setIsNextStep] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [isExitPopupOpen, setIsExitPopupOpen] = useState(false);
  // Modal Button Guidelines: primary actions are never disabled — clicking while incomplete
  // triggers inline validation instead. These flags gate that inline display per step.
  const [isAnswerValidationTriggered, setIsAnswerValidationTriggered] = useState(false);
  const [isQueriesValidationTriggered, setIsQueriesValidationTriggered] = useState(false);
  const [matchingMode, setMatchingMode] = useState<GuidedAnswerMatchingModeType>(GUIDED_ANSWER_MATCHING_MODE.QUERIES);
  const [intentDescription, setIntentDescription] = useState('');
  // Prototype switch (localStorage, see gaPrototypeVariant.ts): V4 = intent-first generation, V3 = matching modes
  const isV4Prototype = getGaPrototypeVariant() === GA_PROTOTYPE_VARIANT.V4;
  const [wasQueryTipDisplayed, setWasQueryTipDisplayed] = useLocalStorage('guidedAiAnswerQueryTipShown', false);
  const isCustomMessageType = answerProperties.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE;
  const isBpaMode = answerProperties.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.BPA;
  const isIntentMode = !isV4Prototype && matchingMode === GUIDED_ANSWER_MATCHING_MODE.INTENT;
  const intentMinLength = isCustomMessageType
    ? INTENT_DESCRIPTION_MIN_LENGTH_CUSTOM_MESSAGE
    : INTENT_DESCRIPTION_MIN_LENGTH;

  const {
    customMessageMap,
    setCustomMessageMap,
    customMessageLanguageList,
    getCustomMessageByLanguage,
    validateCustomMessage,
  } = useCustomMessage();

  const languageList = useMemo(() => {
    return isCustomMessageType ? customMessageLanguageList : answerProperties.guideLanguageList;
  }, [isCustomMessageType, customMessageLanguageList, answerProperties.guideLanguageList]);

  const { t } = useTranslation();

  const onSubmitProxy = async () => {
    if (isAddingDisabled) {
      setIsQueriesValidationTriggered(true);
      return;
    }
    const { guideId, startFromStepId, stepStartType, guideLaunchMode } = answerProperties;
    if (!guideLaunchMode) return;
    if (!isCustomMessageType && (!guideId || (!isBpaMode && !stepStartType))) return;

    setIsLoading(true);
    const matchingProperties = isV4Prototype
      ? {}
      : {
          matchingMode,
          intentDescription: isIntentMode ? intentDescription.trim() : undefined,
        };
    const guidedAnswerToAdd: Omit<AiSourceDto.CreateGuidedAnswer, 'teamId'> = {
      name: name.trim(),
      properties: isCustomMessageType
        ? {
            guideLaunchMode,
            customMessage: getCustomMessageByLanguage(),
            ...matchingProperties,
          }
        : {
            guideLaunchMode,
            guideId: answerProperties.guideId!,
            startFromStepId,
            stepStartType,
            ...matchingProperties,
          },
      queries: isIntentMode
        ? []
        : Object.entries(queriesByLanguage)
            .flatMap(([language, queryById]) =>
              Object.values(queryById).map(query => {
                const trimmedQuery = query.trim();
                return trimmedQuery ? { query: trimmedQuery, language } : null;
              })
            )
            .filter(Boolean),
    };
    // The API resolves with the created source id; the declared type is looser, hence the cast.
    const createdSource = (await onSubmit(guidedAnswerToAdd)) as AiSourceDto.CreatedAiSource | number | undefined;
    if (isIntentMode && createdSource) {
      const createdSearchSourceId = typeof createdSource === 'number' ? createdSource : createdSource.searchSourceId;
      if (createdSearchSourceId) {
        markIntentProcessingMock(createdSearchSourceId);
      }
    }
    setIsLoading(false);
    onPostSubmit();
  };

  const updateQueriesBasedOnLanguageList = (newLanguageList: string[], previousLanguageList: string[]) => {
    const isQueriesByLanguageEmpty = Object.keys(queriesByLanguage).length === 0;
    const languageListToAdd = isQueriesByLanguageEmpty
      ? newLanguageList
      : newLanguageList.filter(language => !previousLanguageList.includes(language));
    const languageListToRemove = isQueriesByLanguageEmpty
      ? []
      : previousLanguageList.filter(language => !newLanguageList.includes(language));

    if (languageListToAdd.length === 0 && languageListToRemove.length === 0) {
      return;
    }

    const updatedQueriesByLanguage = produce(queriesByLanguage, draft => {
      languageListToAdd.forEach(language => {
        draft[language] = draftQueriesByLanguage[language] || {
          [uuidv4()]: '',
        };
      });
      languageListToRemove.forEach(language => {
        delete draft[language];
      });
    });
    setDraftQueriesByLanguage(
      produce(draftQueriesByLanguage, draft => {
        languageListToAdd.forEach(language => {
          delete draft[language];
        });
        languageListToRemove.forEach(language => {
          draft[language] = queriesByLanguage[language];
        });
      })
    );

    setQueriesByLanguage(updatedQueriesByLanguage);
    setCurrentLanguage(Object.keys(updatedQueriesByLanguage)[0]);
  };

  const onAnswerGuidePropertiesChange = (data: AnswerProperties) => {
    // if it's setting a new guide, we need to update the queries based on the new language list
    if (data.guideLanguageList.length) {
      updateQueriesBasedOnLanguageList(data.guideLanguageList, languageList);
    } else if (
      answerProperties.guideLaunchMode !== GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE &&
      !answerProperties.customMessage &&
      data.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE
    ) {
      setCustomMessageMap(
        answerProperties.guideLanguageList.length
          ? Object.fromEntries(
              answerProperties.guideLanguageList.map(language => [uuidv4(), { language, message: '' }])
            )
          : { [uuidv4()]: { language: defaultLanguage, message: '' } }
      );
    }
    setAnswerProperties(data);
  };

  // V4 prototype: approved suggestions from the generate panel become plain queries
  const onAddGeneratedQueries = (queryTextListByLanguage: { [language: string]: string[] }) => {
    setQueriesByLanguage(
      produce(queriesByLanguage, draft => {
        Object.entries(queryTextListByLanguage).forEach(([language, queryTextList]) => {
          if (!draft[language]) {
            draft[language] = {};
          }
          queryTextList.forEach(queryText => {
            draft[language][uuidv4()] = queryText;
          });
        });
      })
    );
  };

  const { hasQueries, hasQueriesError } = useMemo(() => {
    const queryList = Object.values(queriesByLanguage).flatMap(queryById =>
      Object.values(queryById).map(query => query)
    );
    return {
      hasQueries: queryList.some(query => !!query.trim()),
      hasQueriesError: queryList.some(query => query.length > QUERY_MAX_LENGTH),
    };
  }, [queriesByLanguage]);

  const isNextStepDisabled =
    !name.trim() ||
    !answerProperties.guideLaunchMode ||
    (answerProperties.guideLaunchMode !== GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE && !answerProperties.guideId);
  const isAddingDisabled =
    isNextStep &&
    (isIntentMode ? !isIntentDescriptionValid(intentDescription, intentMinLength) : !hasQueries || hasQueriesError);

  const onCancelProxy = () => {
    if (name.trim().length > 0 || !!answerProperties.guideId || hasQueries || intentDescription.trim().length > 0) {
      setIsExitPopupOpen(true);
    } else {
      onCancel();
    }
  };

  const onNextStepClick = () => {
    if (isNextStepDisabled) {
      setIsAnswerValidationTriggered(true);
      return;
    }
    if (isCustomMessageType) {
      updateQueriesBasedOnLanguageList(
        Object.values(customMessageMap)
          .map(message => message.language)
          .filter(Boolean),
        Object.keys(queriesByLanguage)
      );
      const hasErrors = validateCustomMessage();
      if (hasErrors) {
        return;
      }
    }
    setIsNextStep(true);
  };

  return (
    <>
      <ModalWindow>
        <ActionsDialog
          data-cy="addGuidedAnswerDialog"
          title={t(
            isNextStep
              ? isIntentMode
                ? `AiSources.GuidedAnswers.MatchingMode`
                : `AiSources.GuidedAnswers.AssignQueriesTitle`
              : `AiSources.GuidedAnswers.AddAnswerTitle`
          )}
          primaryAction={isNextStep ? onSubmitProxy : onNextStepClick}
          primaryLabel={t(
            isNextStep ? 'AiSources.GuidedAnswers.AddAnswerButton' : 'AiSources.GuidedAnswers.AddQueries'
          )}
          secondaryAction={onCancel}
          secondaryLabel={t('Global.Cancel')}
          primaryIsLoading={isLoading}
          closeAction={onCancelProxy}
          tertiaryRender={() =>
            isNextStep ? (
              <ButtonMinimal onClick={() => setIsNextStep(false)}>{t('Global.Back')}</ButtonMinimal>
            ) : undefined
          }
        >
          {isNextStep ? (
            <ColumnFlex gap={3}>
              {isV4Prototype ? (
                <>
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
                </>
              ) : (
                <MatchingModeSelect matchingMode={matchingMode} onMatchingModeChange={setMatchingMode} />
              )}
              {isIntentMode ? (
                <IntentSettings
                  intentDescription={intentDescription}
                  onIntentDescriptionChange={setIntentDescription}
                  minLength={intentMinLength}
                  showValidation={isQueriesValidationTriggered}
                />
              ) : (
                <>
                  {isQueriesValidationTriggered && !hasQueries && (
                    <Notification severity="error" data-cy="queriesRequiredError">
                      {t('AiSources.GuidedAnswers.AddQueriesRequiredError')}
                    </Notification>
                  )}
                  <QueriesSettings
                    withoutTip={isV4Prototype}
                    queriesByLanguage={queriesByLanguage}
                    onQueriesChange={({ queriesByLanguage: updatedQueriesByLanguage }) =>
                      setQueriesByLanguage(updatedQueriesByLanguage)
                    }
                    currentLanguage={currentLanguage}
                    setCurrentLanguage={setCurrentLanguage}
                    languageList={languageList}
                    languageSelectMessage={`${t(
                      isCustomMessageType
                        ? 'AiSources.GuidedAnswers.SelectLanguageInfoCustomMessage'
                        : 'AiSources.GuidedAnswers.SelectLanguageInfoGuide'
                    )}
                  `}
                  />
                </>
              )}
            </ColumnFlex>
          ) : (
            <AnswerSettings
              name={name}
              setName={setName}
              properties={answerProperties}
              setProperties={onAnswerGuidePropertiesChange}
              teamId={teamId}
              showValidation={isAnswerValidationTriggered}
            />
          )}
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
