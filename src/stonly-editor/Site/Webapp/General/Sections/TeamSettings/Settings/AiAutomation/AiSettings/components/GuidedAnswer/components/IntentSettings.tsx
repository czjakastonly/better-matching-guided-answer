import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import { InputTextarea } from '@ui/components/inputs/InputTextarea';

export const INTENT_DESCRIPTION_MIN_LENGTH = 30;
export const INTENT_DESCRIPTION_MIN_LENGTH_CUSTOM_MESSAGE = 60;
export const INTENT_DESCRIPTION_MAX_LENGTH = 500;
const INTENT_DESCRIPTION_TIP_THRESHOLD = 80;

export const isIntentDescriptionValid = (intentDescription: string, minLength: number) => {
  const trimmedLength = intentDescription.trim().length;
  return trimmedLength >= minLength && trimmedLength <= INTENT_DESCRIPTION_MAX_LENGTH;
};

const Message = styled.span<{ $textColor?: string }>`
  ${({ theme }) => theme.typography.uiElementSmall};
  color: ${({ theme, $textColor }) => $textColor || theme.color.textSubtle};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Counter = styled.span`
  ${({ theme }) => theme.typography.uiElementSmall};
  color: ${({ theme }) => theme.color.textSubtle};
  flex: none;
`;

interface IntentSettingsProps {
  intentDescription: string;
  onIntentDescriptionChange: (intentDescription: string) => void;
  minLength: number;
  helperMessage?: string;
  /** Set after a primary-action click while the field is still empty (Modal Button Guidelines: never disable, validate inline instead). */
  showValidation?: boolean;
}

export const IntentSettings = ({
  intentDescription,
  onIntentDescriptionChange,
  minLength,
  helperMessage,
  showValidation = false,
}: IntentSettingsProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const trimmedLength = intentDescription.trim().length;
  const isTooShort = trimmedLength > 0 && trimmedLength < minLength;
  const isRequiredError = showValidation && trimmedLength === 0;
  const shouldShowTip = trimmedLength >= minLength && trimmedLength < INTENT_DESCRIPTION_TIP_THRESHOLD;

  const getMessage = () => {
    if (isRequiredError) {
      return { text: t('Global.RequiredFieldError'), textColor: theme.color.textDanger };
    }
    if (isTooShort) {
      return { text: t('AiSources.GuidedAnswers.IntentDescriptionTooShort', { min: minLength }), textColor: theme.color.textDanger };
    }
    if (shouldShowTip) {
      return { text: t('AiSources.GuidedAnswers.IntentDescriptionTip'), textColor: theme.color.textWarning };
    }
    return { text: helperMessage || t('AiSources.GuidedAnswers.IntentDescriptionHelper'), textColor: undefined };
  };
  const { text: messageText, textColor: messageColor } = getMessage();

  return (
    <ColumnFlex gap={0.5}>
      <InputTextarea
        data-cy="intentDescriptionInput"
        label={t('AiSources.GuidedAnswers.IntentDescriptionLabel')}
        value={intentDescription}
        onChangeValue={onIntentDescriptionChange}
        placeholder={t('AiSources.GuidedAnswers.IntentDescriptionPlaceholder')}
        maxLength={INTENT_DESCRIPTION_MAX_LENGTH}
        minRows={3}
        status={isTooShort || isRequiredError ? 'error' : undefined}
      />
      <RowFlex justifyContent="space-between" alignItems="baseline" gap={2}>
        <Message data-cy="intentDescriptionMessage" $textColor={messageColor} title={messageText}>
          {messageText}
        </Message>
        <Counter data-cy="intentDescriptionCounter">
          {intentDescription.length} / {INTENT_DESCRIPTION_MAX_LENGTH}
        </Counter>
      </RowFlex>
    </ColumnFlex>
  );
};
