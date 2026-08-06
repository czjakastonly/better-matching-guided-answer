import React, { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { uniq } from 'lodash';
import { appUrl } from '@stonlyCommons/global/env';
import { FEATURE_FLAG, GUIDE_TYPE } from '@stonlyCommons/global';
import GuideFinder from '@editorCommon/CustomElements/ExplanationFinder';
import { InputText } from '@ui/components/inputs/InputText';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import { InputDropdown } from '@ui/components/inputs/InputDropdown';
import { List, ListBody, ListItemStandard, ListHeader, ListHeaderTitle } from '@ui/components/List';
import { withListBox, withListBoxOption } from '@ui/components/ListBox';
import { Tooltip } from '@ui/components/Tooltip/Tooltip';
import { ButtonOutline } from '@ui/components/buttons/ButtonOutline';
import ChevronRightIconSVG from '@ui/atoms/icons/ChevronRight-12.svg';
import StepSelect from 'stonly-editor/Site/Webapp/General/Sections/TeamSettings/Settings/Widget/components/StepSelect';
import {
  GUIDED_ANSWER_START,
  type GuidedAnswerStartType,
  GUIDED_ANSWER_LAUNCH_MODE,
  type GuidedAnswerLaunchModeType,
  AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS,
} from 'stonly-editor/model/aiSource/aiSource.enum';
import useFeatureFlags from '@editorCommon/hooks/useFeatureFlags';
import { type AiSourceDto } from 'stonly-editor/api/aiSource/aiSource.dto';
import { InputSelect } from '@ui/components/inputs/InputSelect';
import { Option } from '@ui/components/Select';
import CustomMessage from '@ui/atoms/icons/CustomMessage-16.svg';
import Guide from '@ui/atoms/icons/Guide-16.svg';
import AutomaticStep from '@ui/atoms/icons/AutomaticStep-16.svg';
import { Notification } from '@ui/components/notifications';
import { MessageSettings } from './MessageSettings';

const GuidePickerWrap = styled.div<{ guideId?: string }>`
  width: ${props => (props.guideId ? 'calc(100% - 48px)' : '100%')};
`;

const ListBox = withListBox(ListBody);
const ListOption = withListBoxOption(ListItemStandard);

export type AnswerProperties = Partial<AiSourceDto.GuidedAnswerProperties> & {
  guideTitle: string;
  guideLanguageList: string[];
  stepName?: string;
  isBpaEnabled?: boolean;
};

interface AnswerSettingsProps {
  teamId: number;
  properties: AnswerProperties;
  setProperties: (props: AnswerProperties) => void;
  name: string;
  setName: (name: string) => void;
  withPadding?: boolean;
  updateQueriesBasedOnLanguageList?: (newLanguageList: string[], oldLanguageList: string[]) => void;
  /** Set after a primary-action click while required fields are still empty (see Modal Button Guidelines: primary actions are never disabled, they validate inline instead). */
  showValidation?: boolean;
}

export const AnswerSettings = ({
  properties,
  setProperties,
  teamId,
  name,
  setName,
  withPadding = false,
  updateQueriesBasedOnLanguageList,
  showValidation = false,
}: AnswerSettingsProps) => {
  const guideDropdownRef = useRef<HTMLButtonElement>(null);
  const stepDropdownRef = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();
  const { getIsFeatureFlagEnabledForTeam } = useFeatureFlags();
  const isBpaFeatureEnabled = getIsFeatureFlagEnabledForTeam(teamId, FEATURE_FLAG.BPA);

  const {
    guideId,
    stepStartType,
    stepName,
    guideTitle,
    guideLaunchMode,
    isBpaEnabled: isBpaEnabledInGuide,
  } = properties;
  const [isStepSelectionVisible, setIsStepSelectionVisible] = useState(
    stepStartType === GUIDED_ANSWER_START.SPECIFIC_STEP
  );
  const isCustomMessageMode = guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE;
  const isBpaMode = guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.BPA;
  const isGuideMode =
    guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.EMBEDDED || guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.REDIRECTED;

  const buildGuideLanguageList = (guide: { languageList: string }) =>
    uniq(
      guide.languageList
        .split(',')
        .filter(language => AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS.includes(language))
    );

  const onSelectGuide = (title: string, id: string, guide: { languageList: string; bpaEnabled: boolean }) => {
    setProperties({
      ...properties,
      guideId: id,
      guideTitle: title,
      guideLanguageList: buildGuideLanguageList(guide),
      startFromStepId: undefined,
      stepName: '',
      stepStartType: isBpaMode ? undefined : GUIDED_ANSWER_START.FIRST_STEP,
      isBpaEnabled: guide.bpaEnabled,
    });
    if (guideDropdownRef.current) {
      guideDropdownRef.current.close();
    }
  };

  const onSelectStartType = (startType: GuidedAnswerStartType) => {
    if (startType === GUIDED_ANSWER_START.FIRST_STEP) {
      setProperties({ ...properties, startFromStepId: undefined, stepName: '', stepStartType: startType });
      if (stepDropdownRef.current) {
        stepDropdownRef.current.close();
      }
    } else {
      setIsStepSelectionVisible(true);
    }
  };

  const onSelectStep = (id: number, name: string) => {
    setProperties({
      ...properties,
      startFromStepId: id,
      stepName: name,
      stepStartType: GUIDED_ANSWER_START.SPECIFIC_STEP,
    });
    if (stepDropdownRef.current) {
      stepDropdownRef.current.close();
    }
  };

  const getStartTypeLabel = useCallback(
    (startType?: GuidedAnswerStartType) => {
      if (!startType) {
        return undefined;
      }
      return startType === GUIDED_ANSWER_START.FIRST_STEP
        ? t('ExplanationEditNextSteps.EmbeddedGuideStartTypeFirstStep')
        : t('ExplanationEditNextSteps.EmbeddedGuideStartTypeSpecificStep');
    },
    [t]
  );

  const onChangeGuideLaunchMode = (value?: GuidedAnswerLaunchModeType) => {
    const isCustomMessageSelected = value === GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE;
    const isGuideModeSelected =
      value === GUIDED_ANSWER_LAUNCH_MODE.EMBEDDED || value === GUIDED_ANSWER_LAUNCH_MODE.REDIRECTED;
    const initialGuideProperties = {
      guideId: undefined,
      guideTitle: '',
      guideLanguageList: [],
    };
    const initialStepProperties = {
      stepStartType: undefined,
      startFromStepId: undefined,
      stepName: '',
    };
    setProperties({
      ...properties,
      guideLaunchMode: value,
      ...(isGuideModeSelected
        ? { stepStartType: properties?.stepStartType || GUIDED_ANSWER_START.FIRST_STEP }
        : initialStepProperties),
      ...(isCustomMessageSelected ? initialGuideProperties : {}),
    });
  };

  const hasNameError = showValidation && !name.trim();
  const hasLaunchModeError = showValidation && !guideLaunchMode;
  const hasGuideError = showValidation && (isGuideMode || isBpaMode) && !guideId;

  return (
    <ColumnFlex gap={2} padding={withPadding ? 4 : 0}>
      <InputText
        data-cy="nameInput"
        label={t('AiSources.GuidedAnswers.AddNameLabel')}
        placeholder={t('AiSources.GuidedAnswers.AddNamePlaceholder')}
        value={name}
        onChangeValue={setName}
        autoFocus
        maxLength={255}
        status={hasNameError ? 'error' : undefined}
        message={hasNameError ? t('Global.RequiredFieldError') : undefined}
      />
      <InputSelect
        data-cy="answerType"
        label={t('AiSources.GuidedAnswers.AnswerType')}
        placeholder={t('AiSources.GuidedAnswers.AnswerTypePlaceholder')}
        value={isGuideMode ? GUIDED_ANSWER_LAUNCH_MODE.EMBEDDED : guideLaunchMode || ''}
        onChangeValue={value => onChangeGuideLaunchMode(value as GuidedAnswerLaunchModeType)}
        status={hasLaunchModeError ? 'error' : undefined}
        message={hasLaunchModeError ? t('Global.RequiredFieldError') : undefined}
      >
        <Option
          value={GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE}
          label={t('AiSources.GuidedAnswers.CustomMessage')}
          iconLeft={<CustomMessage />}
        />
        <Option
          value={GUIDED_ANSWER_LAUNCH_MODE.EMBEDDED}
          label={t('AiSources.GuidedAnswers.GuideToLoad')}
          iconLeft={<Guide />}
        />
        {isBpaFeatureEnabled && (
          <Option
            value={GUIDED_ANSWER_LAUNCH_MODE.BPA}
            label={t('AiSources.GuidedAnswers.BusinessProcessAgent')}
            iconLeft={<AutomaticStep />}
          />
        )}
      </InputSelect>
      {(isGuideMode || isBpaMode) && (
        <RowFlex alignItems="flex-end">
          <GuidePickerWrap guideId={guideId}>
            <InputDropdown
              ref={guideDropdownRef}
              label={t(isBpaMode ? 'AiSources.GuidedAnswers.SourceGuide' : 'AiSources.GuidedAnswers.GuideToLoad')}
              isFlipDisabled
              placement="bottom-start"
              data-cy="guideSelect"
              labelTrigger={guideTitle || t('AdminConsole.PageRuleGuideToLoadPlaceholder')}
              iconLeft={guideId ? <Guide /> : undefined}
              isPlaceholder={!guideId}
              status={hasGuideError ? 'error' : undefined}
              message={hasGuideError ? t('Global.RequiredFieldError') : undefined}
            >
              <GuideFinder
                teamToShow={teamId}
                maxHeight="256px"
                actionOnSelect={onSelectGuide}
                headerText={t(
                  isBpaMode ? 'AiSources.GuidedAnswers.SourceGuide' : 'AiSources.GuidedAnswers.GuideToLoad'
                )}
                guideTypesToShow={[GUIDE_TYPE.GUIDE, GUIDE_TYPE.GUIDED_TOUR, GUIDE_TYPE.ARTICLE]}
                maxWidth="unset"
                requiredGuideLanguageList={AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS}
                shouldShowBpaBadge={isBpaMode}
              />
            </InputDropdown>
          </GuidePickerWrap>
          {!!guideId && (
            <RowFlex marginLeft={3} marginBottom={1}>
              <Tooltip content={t('ExplanationEditNextSteps.GoToGuide')} placement="top-end">
                <ButtonOutline
                  data-cy="goToGuideButton"
                  size="small"
                  data-link={`${appUrl as string}/app/guide/${guideId}/editor/`}
                  onClick={() => window.open(`${appUrl as string}/app/guide/${guideId}/editor/`, '_blank')}
                  iconOnly={<ChevronRightIconSVG />}
                />
              </Tooltip>
            </RowFlex>
          )}
        </RowFlex>
      )}
      {isBpaMode && !!guideId && !isBpaEnabledInGuide && (
        <Notification severity="info" data-cy="bpaEnrichmentMessage">
          <ColumnFlex gap={1}>
            <span>{t('AiSources.GuidedAnswers.BpaEnrichmentLine1')}</span>
            <span>{t('AiSources.GuidedAnswers.BpaEnrichmentLine2')}</span>
          </ColumnFlex>
        </Notification>
      )}
      {!!guideId && isGuideMode && (
        <>
          <InputDropdown
            ref={stepDropdownRef}
            label={t('AiSources.GuidedAnswers.GuideStartStepLabel')}
            placement="bottom-start"
            labelTrigger={stepName || getStartTypeLabel(stepStartType)}
            onBlur={() => setIsStepSelectionVisible(stepStartType === GUIDED_ANSWER_START.SPECIFIC_STEP)}
            data-cy="stepStartDropdown"
          >
            <List data-cy="stepStartTypeSelect">
              {isStepSelectionVisible ? (
                <>
                  <ListHeader showBottomDivider>
                    <ListHeaderTitle onBackClick={() => setIsStepSelectionVisible(false)}>
                      {getStartTypeLabel(GUIDED_ANSWER_START.SPECIFIC_STEP)}
                    </ListHeaderTitle>
                  </ListHeader>
                  <StepSelect guideId={guideId} onStepSelect={onSelectStep} showUnlinked={false} />
                </>
              ) : (
                <ListBox value={stepStartType} onAction={onSelectStartType} autoFocus>
                  {Object.values(GUIDED_ANSWER_START).map(startType => (
                    <ListOption
                      key={startType}
                      label={getStartTypeLabel(startType)}
                      value={startType}
                      payload={startType}
                      isNavigationItem={startType === GUIDED_ANSWER_START.SPECIFIC_STEP}
                    />
                  ))}
                </ListBox>
              )}
            </List>
          </InputDropdown>
          <InputSelect
            data-cy="displayModeSelect"
            value={guideLaunchMode || GUIDED_ANSWER_LAUNCH_MODE.EMBEDDED}
            label={t('AiSources.GuidedAnswers.ModeLabel')}
            onChangeValue={value =>
              setProperties({ ...properties, guideLaunchMode: value as GuidedAnswerLaunchModeType })
            }
          >
            <Option
              value={GUIDED_ANSWER_LAUNCH_MODE.EMBEDDED}
              label={t('AiSources.GuidedAnswers.ModeEmbeddedLabel')}
              description={t('AiSources.GuidedAnswers.ModeEmbeddedDescription')}
            />
            <Option
              value={GUIDED_ANSWER_LAUNCH_MODE.REDIRECTED}
              label={t('AiSources.GuidedAnswers.ModeRedirectedLabel')}
              description={t('AiSources.GuidedAnswers.ModeRedirectedDescription')}
            />
          </InputSelect>
        </>
      )}

      {isCustomMessageMode && <MessageSettings updateQueriesBasedOnLanguageList={updateQueriesBasedOnLanguageList} />}
    </ColumnFlex>
  );
};
