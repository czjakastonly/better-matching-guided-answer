import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import produce from 'immer';
import { ActionsDialog } from '@ui/components/dialogs/ActionsDialog';
import { ModalWindow } from '@ui/components/ModalWindow';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import { type AiSourceDto } from 'stonly-editor/api/aiSource/aiSource.dto';
import { uuidv4 } from '@stonlyCommons/helpers/randomValues';
import { ColumnFlex } from '@ui/components/Flex';
import { Notification } from '@ui/components/notifications';
import { GUIDED_ANSWER_LAUNCH_MODE } from 'stonly-editor/model/aiSource/aiSource.enum';
import {
  type AnswerProperties,
  AnswerSettings,
} from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/components/GuidedAnswer/components/AnswerSettings';
import { useCustomMessage } from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/AiAutomation/AiSettings/components/GuidedAnswer/useCustomMessage';
import { type QueriesByLanguage, QueriesSettings, QUERY_MAX_LENGTH } from './components/QueriesSettings';

/**
 * V3 layout fork (from V2.3) — Creation is a two-step sequential modal (Answer content -> Assign
 * queries); nothing is saved until step 2's "Add answer" commits. Editing stays a single tabbed
 * modal, see EditAnswerDialog. Per Figma node 5170:17304, the modal title itself is always
 * "Add new answer" with a "Step X of 2" caption underneath — "Assign queries" moved from being
 * the step-2 title to a content-level section label next to the new LanguageSelector (see
 * QueriesSettings). "Generate queries" now lives inside QueriesSettings (next to "+ Add query")
 * instead of a separate panel above it — see GenerateQueriesDropdown. Edit files under
 * versions/v3/guidedAnswer when iterating.
 */

const TitleWithStep = styled(ColumnFlex)`
  gap: 8px;
`;

const StepCaption = styled.span`
  ${({ theme }) => theme.typography.uiElement};
  color: ${({ theme }) => theme.color.textSubtle};
`;

// ActionsDialog's shared DialogContent has no top padding of its own (it's `0px 32px 32px 32px`,
// shared by every dialog across every version) — step 1's own content adds the extra 24px top
// inset locally instead of changing that shared component, so v1/v2 stay untouched.
const StepOneContent = styled.div`
  padding-top: 24px;
`;

export const AddAnswerDialog = ({
  onCancel,
  onSubmit,
  onPostSubmit,
  teamId,
  defaultLanguage,
}: {
  onCancel: () => void;
  onSubmit: (values: Omit<AiSourceDto.CreateGuidedAnswer, 'teamId'>) => Promise<void | AiSourceDto.CreatedAiSource>;
  onPostSubmit: () => void;
  teamId: number;
  defaultLanguage: string;
}) => {
  const [name, setName] = useState('');
  const [answerProperties, setAnswerProperties] = useState<AnswerProperties>({
    guideTitle: '',
    stepName: '',
    guideLanguageList: [],
  });
  const [queriesByLanguage, setQueriesByLanguage] = useState<QueriesByLanguage>({});
  const [draftQueriesByLanguage, setDraftQueriesByLanguage] = useState<QueriesByLanguage>({});
  // Maps id -> the original generated text, for any query that was ever AI-generated (kept even
  // after the row is edited away from AI, so the "revert" control can restore it).
  const [aiOriginalTextById, setAiOriginalTextById] = useState<{ [id: string]: string }>({});
  const [intentDescription, setIntentDescription] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [isNextStep, setIsNextStep] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [isExitPopupOpen, setIsExitPopupOpen] = useState(false);
  // Modal Button Guidelines: primary actions are never disabled — clicking while incomplete
  // triggers inline validation instead. These flags gate that inline display per step.
  const [isAnswerValidationTriggered, setIsAnswerValidationTriggered] = useState(false);
  const [isQueriesValidationTriggered, setIsQueriesValidationTriggered] = useState(false);
  const isCustomMessageType = answerProperties.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE;
  const isBpaMode = answerProperties.guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.BPA;

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
    if (!hasQueries || hasQueriesError) {
      setIsQueriesValidationTriggered(true);
      return;
    }
    const { guideId, startFromStepId, stepStartType, guideLaunchMode } = answerProperties;
    if (!guideLaunchMode) return;
    if (!isCustomMessageType && (!guideId || (!isBpaMode && !stepStartType))) return;

    setIsLoading(true);
    const guidedAnswerToAdd: Omit<AiSourceDto.CreateGuidedAnswer, 'teamId'> = {
      name: name.trim(),
      properties: isCustomMessageType
        ? {
            guideLaunchMode,
            customMessage: getCustomMessageByLanguage(),
            intentDescription: intentDescription.trim() || undefined,
          }
        : {
            guideLaunchMode,
            guideId: answerProperties.guideId!,
            startFromStepId,
            stepStartType,
            intentDescription: intentDescription.trim() || undefined,
          },
      queries: Object.entries(queriesByLanguage)
        .flatMap(([language, queryById]) =>
          Object.values(queryById).map(query => {
            const trimmedQuery = query.trim();
            return trimmedQuery ? { query: trimmedQuery, language } : null;
          })
        )
        .filter(Boolean),
    };
    await onSubmit(guidedAnswerToAdd);
    setIsLoading(false);
    onPostSubmit();
  };

  const updateQueriesBasedOnLanguageList = (newLanguageList: string[], previousLanguageList: string[]) => {
    // Diff-based add/remove, regardless of whether queriesByLanguage is currently empty: a
    // per-row custom-message language change (e.g. picking a 2nd language before any language
    // has queries yet) only ever passes a single incremental language here, and treating an
    // empty queriesByLanguage as "replace the whole set" would silently drop other languages
    // (e.g. the first message's language, whose <select> never fired a change event).
    const languageListToAdd = newLanguageList.filter(language => !previousLanguageList.includes(language));
    const languageListToRemove = previousLanguageList.filter(language => !newLanguageList.includes(language));

    if (languageListToAdd.length === 0 && languageListToRemove.length === 0) {
      return;
    }

    const updatedQueriesByLanguage = produce(queriesByLanguage, draft => {
      languageListToAdd.forEach(language => {
        draft[language] = draftQueriesByLanguage[language] || {};
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
    // Keep viewing the current language when possible; otherwise land on the newly added one so
    // its "pending sync" banner (see QueriesSettings) is immediately visible.
    setCurrentLanguage(updatedQueriesByLanguage[currentLanguage] ? currentLanguage : Object.keys(updatedQueriesByLanguage)[0]);
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

  // V2 direct insertion: generated queries are merged straight into the assigned list, and their
  // original text is stored so QueriesSettings can show the AI sparkle (or, once edited away from
  // that original, a "revert to AI-generated" control).
  const onAddGeneratedQueries = (queryTextListByLanguage: { [language: string]: string[] }) => {
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
          });
        });
      })
    );
    setAiOriginalTextById(previous => ({ ...previous, ...newOriginalTextById }));
  };

  const onQueriesChange = ({
    queriesByLanguage: updatedQueriesByLanguage,
    idsToRemove,
  }: {
    queriesByLanguage: QueriesByLanguage;
    counterDiff: number;
    idsToRemove?: string[];
  }) => {
    setQueriesByLanguage(updatedQueriesByLanguage);
    if (idsToRemove?.length) {
      setAiOriginalTextById(previous =>
        produce(previous, draft => {
          idsToRemove.forEach(id => delete draft[id]);
        })
      );
    }
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

  const onCancelProxy = () => {
    if (name.trim().length > 0 || !!answerProperties.guideId || hasQueries) {
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
          size="large"
          showHeaderDivider
          title={
            <TitleWithStep>
              <span>{t('AiSources.GuidedAnswers.AddAnswerTitle')}</span>
              <StepCaption>{t('AiSources.GuidedAnswers.V3.StepCaption', { step: isNextStep ? 2 : 1 })}</StepCaption>
            </TitleWithStep>
          }
          primaryAction={isNextStep ? onSubmitProxy : onNextStepClick}
          primaryLabel={t(
            isNextStep ? 'AiSources.GuidedAnswers.V3.AddAnswerButton' : 'AiSources.GuidedAnswers.V3.AssignQueriesButton'
          )}
          secondaryAction={onCancelProxy}
          secondaryLabel={t('Global.Cancel')}
          primaryIsLoading={isLoading}
          tertiaryRender={() =>
            isNextStep ? (
              <ButtonMinimal onClick={() => setIsNextStep(false)}>{t('AiSources.GuidedAnswers.V2.BackArrow')}</ButtonMinimal>
            ) : undefined
          }
        >
          {isNextStep ? (
            <ColumnFlex gap={3}>
              {isQueriesValidationTriggered && !hasQueries && (
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
                onIntentDescriptionChange={setIntentDescription}
                onAddGeneratedQueries={onAddGeneratedQueries}
              />
            </ColumnFlex>
          ) : (
            <StepOneContent>
              <AnswerSettings
                name={name}
                setName={setName}
                properties={answerProperties}
                setProperties={onAnswerGuidePropertiesChange}
                teamId={teamId}
                showValidation={isAnswerValidationTriggered}
              />
            </StepOneContent>
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
