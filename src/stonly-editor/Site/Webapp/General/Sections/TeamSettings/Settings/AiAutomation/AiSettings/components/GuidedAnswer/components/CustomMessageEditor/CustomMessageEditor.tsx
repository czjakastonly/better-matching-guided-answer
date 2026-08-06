import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputTextarea } from '@ui/components/inputs/InputTextarea';

/**
 * Demo stub of the editor's TipTap-based CustomMessageEditor (same props contract).
 * The real one renders a Wysiwyg toolbar; here a plain textarea keeps the flow intact.
 */
interface CustomMessageEditorProps {
  tempId: string;
  content?: string;
  saveContent: (content: string) => void;
  status?: 'error';
  isCustomMessageType?: boolean;
}

export const CustomMessageEditor = ({
  tempId,
  content = '',
  saveContent,
  status,
  isCustomMessageType,
}: CustomMessageEditorProps) => {
  const { t } = useTranslation();
  return (
    <InputTextarea
      key={tempId}
      value={content}
      onChangeValue={saveContent}
      status={status}
      minRows={3}
      placeholder={t(
        isCustomMessageType
          ? 'AiSources.GuidedAnswers.CustomMessageContentPlaceholder'
          : 'AiSources.GuidedAnswers.CustomLoadingMessagePlaceholder'
      )}
    />
  );
};
