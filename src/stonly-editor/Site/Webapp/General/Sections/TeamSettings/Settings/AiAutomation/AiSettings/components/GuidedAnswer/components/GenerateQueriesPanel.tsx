import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import { ButtonPrimary } from '@ui/components/buttons/ButtonPrimary';
import { FieldCheck } from '@ui/components/inputs/FieldCheck';
import { TooltipIcon } from '@ui/components/Tooltip/TooltipIcon';
import { FieldGroup } from '@ui/components/inputs/components/FieldGroup';
import { supportedLanguages } from '@stonlyCommons/helpers/i18n.helpers';
import {
  IntentSettings,
  INTENT_DESCRIPTION_MIN_LENGTH,
  INTENT_DESCRIPTION_MIN_LENGTH_CUSTOM_MESSAGE,
  isIntentDescriptionValid,
} from './IntentSettings';

/**
 * V4 prototype (frontend-only, NOT for production): always-open panel that "generates"
 * query suggestions from an intent description. One morphing action button:
 * Generate queries -> Add N queries; editing the intent reverts it to Generate.
 * Generation is mocked locally with a fixed delay.
 */
const MOCK_GENERATION_DELAY_MS = 1400;

const buildMockSuggestionList = (intentDescription: string, language: string): string[] => {
  const topic = intentDescription
    .trim()
    .replace(
      /^(when|if)\s+(the\s+)?(user|customer|client)s?\s+(asks?\s+(about\s+)?|wants?\s+to\s+|needs?\s+to\s+|can(no|')?t\s+|cannot\s+|has\s+(a\s+)?problems?\s+with\s+)?/i,
      ''
    )
    .replace(/[.?!\s]+$/, '');
  const base = topic || intentDescription.trim();
  const suggestionList = [
    `How do I ${base}?`,
    `I can't ${base}`,
    `${base} is not working`,
    `Help with ${base}`,
    `Where do I find ${base}?`,
    `Problem with ${base}`,
    `${base} keeps failing`,
    `Why can't I ${base}?`,
  ];
  return language === 'en'
    ? suggestionList
    : suggestionList.map(suggestion => `${suggestion} (${language.toUpperCase()})`);
};

const PanelWrap = styled(ColumnFlex)`
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  border-radius: 8px;
`;

const PanelTitle = styled.span`
  ${({ theme }) => theme.typography.uiElementStrong};
  color: ${({ theme }) => theme.color.textDark};
`;

const LanguagesInfo = styled.span`
  ${({ theme }) => theme.typography.uiElementSmall};
  color: ${({ theme }) => theme.color.textSubtle};
`;

interface SuggestionItem {
  text: string;
  isSelected: boolean;
}

interface GenerateQueriesPanelProps {
  languageList: string[];
  currentLanguage: string;
  isCustomMessageType: boolean;
  existingQueryList: string[];
  onAddQueries: (queryTextListByLanguage: { [language: string]: string[] }) => void;
}

export const GenerateQueriesPanel = ({
  languageList,
  currentLanguage,
  isCustomMessageType,
  existingQueryList,
  onAddQueries,
}: GenerateQueriesPanelProps) => {
  const { t } = useTranslation();
  const [intentDescription, setIntentDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestionList, setSuggestionList] = useState<SuggestionItem[] | null>(null);
  const [lastGeneratedIntent, setLastGeneratedIntent] = useState<string | null>(null);

  const intentMinLength = isCustomMessageType
    ? INTENT_DESCRIPTION_MIN_LENGTH_CUSTOM_MESSAGE
    : INTENT_DESCRIPTION_MIN_LENGTH;
  const isIntentValid = isIntentDescriptionValid(intentDescription, intentMinLength);
  const selectedCount = (suggestionList || []).filter(suggestion => suggestion.isSelected).length;
  const hasFreshSuggestions = !!suggestionList && intentDescription.trim() === lastGeneratedIntent;

  const languageNameList = languageList
    .map(language => supportedLanguages.find(supportedLanguage => supportedLanguage.value === language)?.name)
    .filter(Boolean)
    .join(', ');

  const onGenerate = () => {
    setIsGenerating(true);
    setSuggestionList(null);
    const generatedForIntent = intentDescription.trim();
    setTimeout(() => {
      const existingQuerySet = new Set(existingQueryList.map(query => query.trim().toLowerCase()));
      const generatedList = buildMockSuggestionList(intentDescription, currentLanguage)
        .filter(suggestion => !existingQuerySet.has(suggestion.toLowerCase()))
        .map(text => ({ text, isSelected: true }));
      setSuggestionList(generatedList);
      setLastGeneratedIntent(generatedForIntent);
      setIsGenerating(false);
    }, MOCK_GENERATION_DELAY_MS);
  };

  const onToggleSuggestion = (index: number, isSelected: boolean) => {
    setSuggestionList(previousList =>
      (previousList || []).map((suggestion, suggestionIndex) =>
        suggestionIndex === index ? { ...suggestion, isSelected } : suggestion
      )
    );
  };

  const onAddSelected = () => {
    const selectedTextList = (suggestionList || [])
      .filter(suggestion => suggestion.isSelected)
      .map(suggestion => suggestion.text);
    if (selectedTextList.length === 0) return;

    const targetLanguageList = languageList;
    const queryTextListByLanguage = Object.fromEntries(
      targetLanguageList.map(language => [
        language,
        language === currentLanguage
          ? selectedTextList
          : selectedTextList.map(text => `${text} (${language.toUpperCase()})`),
      ])
    );
    onAddQueries(queryTextListByLanguage);
    setSuggestionList(null);
    setLastGeneratedIntent(null);
    setIntentDescription('');
  };

  const onActionClick = () => {
    if (hasFreshSuggestions) {
      onAddSelected();
    } else {
      onGenerate();
    }
  };

  const isActionDisabled = hasFreshSuggestions ? selectedCount === 0 : !isIntentValid;

  return (
    <PanelWrap gap={2} padding={2} data-cy="generateQueriesPanel">
      <PanelTitle>{t('AiSources.GuidedAnswers.GenerateFromIntent')}</PanelTitle>
      <IntentSettings
        intentDescription={intentDescription}
        onIntentDescriptionChange={setIntentDescription}
        minLength={intentMinLength}
        helperMessage={t(
          isCustomMessageType
            ? 'AiSources.GuidedAnswers.IntentPanelHelperCustomMessage'
            : 'AiSources.GuidedAnswers.IntentPanelHelperGuide'
        )}
      />
      {languageList.length > 1 && (
        <RowFlex gap={0.5} alignItems="center">
          <LanguagesInfo data-cy="generateAllLanguagesInfo">
            {t('AiSources.GuidedAnswers.GenerateAllLanguages', { count: languageList.length })}
          </LanguagesInfo>
          <TooltipIcon>{languageNameList}</TooltipIcon>
        </RowFlex>
      )}
      {suggestionList && suggestionList.length > 0 && (
        <FieldGroup label={t('AiSources.GuidedAnswers.SuggestedQueriesLabel')}>
          <ColumnFlex gap={1.5}>
            {suggestionList.map((suggestion, index) => (
              <FieldCheck
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                type="checkbox"
                data-cy="suggestedQueryCheckbox"
                label={suggestion.text}
                checked={suggestion.isSelected}
                onChangeChecked={isSelected => onToggleSuggestion(index, isSelected)}
              />
            ))}
          </ColumnFlex>
        </FieldGroup>
      )}
      <RowFlex justifyContent="flex-end">
        <ButtonPrimary
          onClick={onActionClick}
          isLoading={isGenerating}
          disabled={isActionDisabled}
          data-cy="generatePanelActionButton"
        >
          {t(
            hasFreshSuggestions
              ? 'AiSources.GuidedAnswers.AddSelectedQueries'
              : 'AiSources.GuidedAnswers.GenerateButton',
            { count: selectedCount }
          )}
        </ButtonPrimary>
      </RowFlex>
    </PanelWrap>
  );
};
