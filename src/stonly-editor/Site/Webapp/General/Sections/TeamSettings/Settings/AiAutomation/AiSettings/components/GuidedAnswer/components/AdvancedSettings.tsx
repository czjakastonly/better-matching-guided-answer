import React from 'react';
import { useTranslation } from 'react-i18next';
import { produce } from 'immer';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { ColumnFlex } from '@ui/components/Flex';
import { InputSelect } from '@ui/components/inputs/InputSelect';
import { Option } from '@ui/components/Select';
import { supportedLanguages } from '@stonlyCommons/helpers/i18n.helpers';
import { CustomMessageEditor } from './CustomMessageEditor/CustomMessageEditor';

interface AdvancedProps {
  customLoadingMessage: { [key: string]: string };
  setCustomLoadingMessage: (customLoadingMessage: { [key: string]: string }) => void;
  languageList: string[];
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
}

export const AdvancedSettings = ({
  customLoadingMessage = {},
  setCustomLoadingMessage,
  languageList,
  currentLanguage,
  setCurrentLanguage,
}: AdvancedProps) => {
  const { t } = useTranslation();

  const onChangeMessageContent = (message: string) => {
    setCustomLoadingMessage(
      produce(customLoadingMessage, draft => {
        draft[currentLanguage] = message;
      })
    );
  };

  return (
    <ColumnFlex gap={2} padding={4}>
      <InputSelect
        value={currentLanguage}
        onChangeValue={setCurrentLanguage}
        label={t('AiSources.GuidedAnswers.SelectLanguageLabel')}
      >
        {languageList.map(lang => (
          <Option
            key={lang}
            value={lang}
            label={supportedLanguages.find(supportedLanguage => supportedLanguage.value === lang)?.name}
          />
        ))}
      </InputSelect>
      <InputWrap label={t('AiSources.GuidedAnswers.CustomLoadingMessage')}>
        <CustomMessageEditor
          content={customLoadingMessage[currentLanguage] || ''}
          saveContent={onChangeMessageContent}
        />
      </InputWrap>
    </ColumnFlex>
  );
};
