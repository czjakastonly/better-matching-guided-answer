import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import MinusSVG from '@ui/atoms/icons/Minus-12.svg';
import { ButtonOutline } from '@ui/components/buttons/ButtonOutline';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import { Option } from '@ui/components/Select';
import { InputSelect } from '@ui/components/inputs/InputSelect';
import { AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS } from 'stonly-editor/model/aiSource/aiSource.enum';
import { supportedLanguages } from '@stonlyCommons/helpers/i18n.helpers';
import { InputWrap } from '@ui/components/inputs/components/InputWrap';
import { CustomMessageEditor } from './CustomMessageEditor/CustomMessageEditor';
import { useCustomMessage, type MessageToAdd } from '../useCustomMessage';

const RemoveWrapper = styled.div`
  padding: 6px 0;
`;

interface AddMessageProps {
  tempId: string;
  customMessageData: MessageToAdd;
  usedLanguageList?: string[];
  updateQueriesBasedOnLanguageList?: (newLanguageList: string[], oldLanguageList: string[]) => void;
  isRemovingEnabled: boolean;
}

const AddMessage = ({
  tempId,
  customMessageData,
  usedLanguageList,
  updateQueriesBasedOnLanguageList,
  isRemovingEnabled,
}: AddMessageProps) => {
  const { t } = useTranslation();

  const { language, message, hasLanguageError, hasMessageError } = customMessageData;

  const { editCustomMessageContent, editCustomMessageLanguage, removeCustomMessage } = useCustomMessage();

  const onEditLanguage = (newLanguage: string) => {
    editCustomMessageLanguage(tempId, {
      language: newLanguage,
      hasLanguageError: hasLanguageError ? !newLanguage : undefined,
    });
    if (updateQueriesBasedOnLanguageList && newLanguage !== language) {
      updateQueriesBasedOnLanguageList([newLanguage].filter(Boolean), [language].filter(Boolean));
    }
  };

  const onRemoveCustomMessage = () => {
    removeCustomMessage(tempId);
    if (updateQueriesBasedOnLanguageList && language) {
      updateQueriesBasedOnLanguageList([], [language]);
    }
  };

  return (
    <RowFlex gap={2}>
      <ColumnFlex flexGrow={1} gap={1}>
        <InputSelect
          data-cy="messageLanguageSelect"
          value={language}
          onChangeValue={onEditLanguage}
          placeholder={t('AiSources.GuidedAnswers.SelectLanguage')}
          status={hasLanguageError ? 'error' : undefined}
          message={hasLanguageError ? t('Global.RequiredFieldError') : undefined}
        >
          {AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS.filter(lang => !usedLanguageList?.includes(lang)).map(lang => (
            <Option
              key={lang}
              value={lang}
              label={supportedLanguages.find(supportedLanguage => supportedLanguage.value === lang)?.name}
            />
          ))}
        </InputSelect>
        <InputWrap
          status={hasMessageError ? 'error' : undefined}
          message={hasMessageError ? t('Global.RequiredFieldError') : undefined}
        >
          <CustomMessageEditor
            key={tempId + language}
            tempId={tempId + language}
            content={message}
            saveContent={content =>
              editCustomMessageContent(tempId, {
                message: content,
                hasMessageError: hasMessageError ? content.trim().length === 0 : undefined,
              })
            }
            status={hasMessageError ? 'error' : undefined}
            isCustomMessageType
          />
        </InputWrap>
      </ColumnFlex>
      {isRemovingEnabled && (
        <RemoveWrapper>
          <ButtonOutline iconOnly={<MinusSVG />} onClick={onRemoveCustomMessage} size="small" />
        </RemoveWrapper>
      )}
    </RowFlex>
  );
};

export default AddMessage;
