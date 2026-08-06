import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import MinusSVG from '@ui/atoms/icons/Minus-12.svg';
import { InputText } from '@ui/components/inputs/InputText';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import { ButtonAdd } from '@ui/components/buttons/ButtonAdd';
import { Notification } from '@ui/components/notifications';
import { ButtonOutline } from '@ui/components/buttons/ButtonOutline';
import useLocalStorage from '@editorCommon/hooks/useLocalStorageValue';
import { InputSelect } from '@ui/components/inputs/InputSelect';
import { Option } from '@ui/components/Select';
import produce from 'immer';
import { uuidv4 } from '@stonlyCommons/helpers/randomValues';
import { supportedLanguages } from '@stonlyCommons/helpers/i18n.helpers';
import { FieldGroup } from '@ui/components/inputs/components/FieldGroup';

const StyledRowFlex = styled(RowFlex)`
  width: 100%;
  & > div:first-of-type {
    flex-grow: 1;
  }
`;

export const QUERY_LIMIT = 500;
export const QUERY_MAX_LENGTH = 250;

export interface QueriesByLanguage {
  [language: string]: { [key: string]: string };
}

interface QueriesSettingsProps {
  queriesByLanguage: QueriesByLanguage;
  onQueriesChange: (data: { queriesByLanguage: QueriesByLanguage; counterDiff: number; idToRemove?: string }) => void;
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  languageList: string[];
  languageSelectMessage?: string;
  withPadding?: boolean;
  withoutTip?: boolean;
}

export const QueriesSettings = ({
  queriesByLanguage,
  onQueriesChange,
  currentLanguage,
  setCurrentLanguage,
  languageList,
  withPadding = false,
  withoutTip = false,
  languageSelectMessage,
}: QueriesSettingsProps) => {
  const [wasTipDisplayed, setWasTipDisplayed] = useLocalStorage('guidedAiAnswerQueryTipShown', false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!languageList.includes(currentLanguage)) {
      setCurrentLanguage(languageList[0]);
    }
  }, [currentLanguage, languageList, setCurrentLanguage]);

  const { isLimitReached, isError, queries } = useMemo(() => {
    const queriesToReturn = queriesByLanguage[currentLanguage] || {};
    return {
      queries: queriesToReturn,
      isLimitReached: Object.keys(queriesToReturn).length === QUERY_LIMIT,
      isError: Object.values(queriesToReturn).some(query => query.length > QUERY_MAX_LENGTH),
    };
  }, [queriesByLanguage, currentLanguage]);

  const onAddQuery = () => {
    onQueriesChange({
      queriesByLanguage: produce(queriesByLanguage, draft => {
        draft[currentLanguage][uuidv4()] = '';
      }),
      counterDiff: 1,
    });
  };

  const onRemoveQuery = (id: string) => {
    onQueriesChange({
      queriesByLanguage: produce(queriesByLanguage, draft => {
        delete draft[currentLanguage][id];
      }),
      counterDiff: -1,
      idToRemove: id,
    });
  };

  const onChangeQuery = (id: string, value: string) => {
    onQueriesChange({
      queriesByLanguage: produce(queriesByLanguage, draft => {
        draft[currentLanguage][id] = value;
      }),
      counterDiff: 0,
    });
  };

  return (
    <ColumnFlex gap={3} padding={withPadding ? 4 : 0} paddingBottom={withPadding ? 6 : 2}>
      {!wasTipDisplayed && !withoutTip && (
        <Notification severity="info" data-cy="guidedAiAnswerQueryTip" onCloseClick={() => setWasTipDisplayed(true)}>
          {t('AiSources.GuidedAnswers.QueryTip')}
        </Notification>
      )}
      {isError && (
        <Notification severity="error" data-cy="guidedAiAnswerQueriesError">
          {t('AiSources.GuidedAnswers.QueriesErrorMessage')}
        </Notification>
      )}
      <InputSelect
        data-cy="languageSelect"
        value={currentLanguage}
        onChangeValue={setCurrentLanguage}
        label={t('AiSources.GuidedAnswers.SelectLanguageLabel')}
        message={languageSelectMessage}
      >
        {languageList.map(lang => (
          <Option
            key={lang}
            value={lang}
            label={supportedLanguages.find(supportedLanguage => supportedLanguage.value === lang)?.name}
          />
        ))}
      </InputSelect>
      {Object.keys(queries).length > 0 && (
        <FieldGroup label={t('AiSources.GuidedAnswers.Queries')}>
          <ColumnFlex gap={2}>
            {Object.keys(queries).map(id => {
              const query = queries[id];
              const hasError = query.length > QUERY_MAX_LENGTH;
              return (
                <StyledRowFlex key={id} gap={2} alignItems="center">
                  <InputText
                    data-cy="queryInput"
                    value={query}
                    onChangeValue={value => onChangeQuery(id, value)}
                    placeholder={t('AiSources.GuidedAnswers.QueryPlaceholder')}
                    status={hasError ? 'error' : undefined}
                    message={
                      hasError
                        ? t('AiSources.GuidedAnswers.QueryLengthError', {
                            length: query.length,
                            maxLength: QUERY_MAX_LENGTH,
                          })
                        : undefined
                    }
                  />
                  <ButtonOutline iconOnly={<MinusSVG />} onClick={() => onRemoveQuery(id)} size="small" />
                </StyledRowFlex>
              );
            })}
            {isLimitReached && (
              <Notification severity="warning" data-cy="guidedAiAnswerQueriesLimit">
                {t('AiSources.GuidedAnswers.QueriesLimitMessage', { limit: QUERY_LIMIT })}
              </Notification>
            )}
          </ColumnFlex>
        </FieldGroup>
      )}
      <ButtonAdd onClick={onAddQuery} data-cy="addQueryButton" disabled={isLimitReached}>
        {t('AiSources.GuidedAnswers.AddNextQuery')}
      </ButtonAdd>
    </ColumnFlex>
  );
};
