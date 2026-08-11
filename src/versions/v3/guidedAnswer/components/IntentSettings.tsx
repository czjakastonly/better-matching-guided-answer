import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import { InputTextarea } from '@ui/components/inputs/InputTextarea';

/**
 * V3 fork of IntentSettings (from V2) — drops the red "too short" error state, and moves the
 * character counter from a row below the field to an inset overlay in the textarea's bottom-right
 * corner. Also gives the field a purple focus/active border, matching the AI-tinted textarea in
 * the sibling QueryIdeationSandbox project's Direction 3 — Two-Lane Split (localhost:5183) —
 * FieldTextarea only exposes status-based border colors, so FieldWithCounter overrides its
 * focus-visible outline for this AI-context field specifically, without forking the shared
 * FieldTextarea component itself. Per Figma node 5170:18303's own "Helper" text treatment: a
 * single, always-shown plain helper line ("Tip: mention situations, symptoms, or phrases users
 * might type") — not the earlier blue tip-box-that-swaps-to-a-different-message-past-80-chars.
 */
export const INTENT_DESCRIPTION_MIN_LENGTH = 30;
export const INTENT_DESCRIPTION_MIN_LENGTH_CUSTOM_MESSAGE = 60;
export const INTENT_DESCRIPTION_MAX_LENGTH = 500;

export const isIntentDescriptionValid = (intentDescription: string, minLength: number) => {
  const trimmedLength = intentDescription.trim().length;
  return trimmedLength >= minLength && trimmedLength <= INTENT_DESCRIPTION_MAX_LENGTH;
};

const FieldWithCounter = styled.div`
  position: relative;

  /* Reserve room at the bottom so typed text never runs under the counter overlay. */
  textarea {
    padding-bottom: 22px !important;
  }

  /* :has() already used by FieldTextarea's own focus-visible outline (see FieldTextarea.styles) —
     same technique, scoped to the field that directly wraps the textarea, so only that border
     turns purple (not the label or message rows above/below it). */
  div:has(> textarea:focus) {
    outline-color: ${({ theme }) => theme.color.iconPurple} !important;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.backgroundPurpleSubtle};
  }
`;

const InsetCounter = styled.span`
  position: absolute;
  right: 12px;
  bottom: 8px;
  ${({ theme }) => theme.typography.uiElementSmall};
  color: ${({ theme }) => theme.color.textSubtle};
  pointer-events: none;
`;

const HelperMessage = styled.span`
  ${({ theme }) => theme.typography.uiElementSmall};
  color: ${({ theme }) => theme.color.textSubtle};
  flex: 1;
  min-width: 0;
`;

interface IntentSettingsProps {
  intentDescription: string;
  onIntentDescriptionChange: (intentDescription: string) => void;
  /** Set after a primary-action click while the field is still empty (Modal Button Guidelines: never disable, validate inline instead). */
  showValidation?: boolean;
}

export const IntentSettings = React.forwardRef<HTMLTextAreaElement, IntentSettingsProps>(
  ({ intentDescription, onIntentDescriptionChange, showValidation = false }, forwardedRef) => {
  const { t } = useTranslation();

  const isRequiredError = showValidation && intentDescription.trim().length === 0;

  return (
    <ColumnFlex gap={1}>
      <FieldWithCounter>
        <InputTextarea
          ref={forwardedRef}
          data-cy="intentDescriptionInput"
          value={intentDescription}
          onChangeValue={onIntentDescriptionChange}
          placeholder={t('AiSources.GuidedAnswers.IntentDescriptionPlaceholder')}
          maxLength={INTENT_DESCRIPTION_MAX_LENGTH}
          minRows={3}
          status={isRequiredError ? 'error' : undefined}
          message={isRequiredError ? t('AiSources.GuidedAnswers.V3.IntentDescriptionRequiredError') : undefined}
        />
        {!isRequiredError && (
          <InsetCounter data-cy="intentDescriptionCounter">
            {intentDescription.length} / {INTENT_DESCRIPTION_MAX_LENGTH}
          </InsetCounter>
        )}
      </FieldWithCounter>
      {!isRequiredError && (
        <RowFlex alignItems="center" gap={2}>
          <HelperMessage data-cy="intentDescriptionTip">
            {t('AiSources.GuidedAnswers.V2.IntentDescriptionTip')}
          </HelperMessage>
        </RowFlex>
      )}
    </ColumnFlex>
  );
  }
);
