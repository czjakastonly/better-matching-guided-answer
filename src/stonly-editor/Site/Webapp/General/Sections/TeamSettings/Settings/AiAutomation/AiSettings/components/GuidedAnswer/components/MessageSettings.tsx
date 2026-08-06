import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnFlex } from '@ui/components/Flex';
import { FieldGroup } from '@ui/components/inputs/components/FieldGroup';
import { ButtonAdd } from '@ui/components/buttons/ButtonAdd';
import AddMessage from './AddMessage';
import { useCustomMessage } from '../useCustomMessage';

export interface MessageSettingsProps {
  updateQueriesBasedOnLanguageList?: (newLanguageList: string[], oldLanguageList: string[]) => void;
}

export const MessageSettings = ({ updateQueriesBasedOnLanguageList }: MessageSettingsProps) => {
  const { t } = useTranslation();
  const { customMessageMap, addCustomMessage } = useCustomMessage();

  return (
    <ColumnFlex gap={3}>
      <FieldGroup label={t('AiSources.GuidedAnswers.CustomMessageSection')}>
        <ColumnFlex gap={3}>
          {Object.entries(customMessageMap).map(([tempId, messageData]) => (
            <AddMessage
              tempId={tempId}
              customMessageData={messageData}
              key={tempId}
              updateQueriesBasedOnLanguageList={updateQueriesBasedOnLanguageList}
              isRemovingEnabled={Object.keys(customMessageMap).length > 1}
              usedLanguageList={Object.values(customMessageMap)
                .map(item => item.language)
                .filter(lang => lang !== messageData.language && Boolean(lang))}
            />
          ))}
        </ColumnFlex>
      </FieldGroup>
      <ButtonAdd onClick={addCustomMessage}>{t('AiSources.GuidedAnswers.AddAnotherLanguage')}</ButtonAdd>
    </ColumnFlex>
  );
};
