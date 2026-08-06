import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import LanguageSVG from '@ui/atoms/icons/Language-16.svg';
import { supportedLanguages } from '@stonlyCommons/helpers/i18n.helpers';
import { Option, SelectMultiple } from '@ui/components/Select';
import { AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS } from 'stonly-editor/model/aiSource/aiSource.enum';
import { sortBy } from 'lodash';

const Wrapper = styled.div``;

const PlaceholderIcon = styled(LanguageSVG)`
  path {
    fill: ${props => props.theme.color.iconSubtle};
  }
`;
const SelectedIcon = styled(LanguageSVG)`
  path {
    fill: ${props => props.theme.color.iconActive};
  }
`;

interface LanguagePickerProps {
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  languageList?: string[];
}

const LanguagePicker = ({
  selectedLanguages,
  setSelectedLanguages,
  languageList = AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS,
}: LanguagePickerProps) => {
  const { t } = useTranslation();

  const languageDataList = useMemo(
    () =>
      sortBy(
        languageList.map(value => {
          return { value, label: supportedLanguages.find(lang => lang.value === value)?.name };
        }),
        'label'
      ),
    [languageList]
  );

  return (
    <Wrapper>
      <SelectMultiple
        maxWidthRatio={1}
        widthPx={160}
        valueList={selectedLanguages}
        onChangeValueList={setSelectedLanguages}
        renderIconLeft={() => (selectedLanguages.length ? <SelectedIcon /> : <PlaceholderIcon />)}
        renderLabel={payloadList =>
          payloadList?.length ? payloadList.map(payload => payload.label).join(', ') : t('AiSources.AllLanguages')
        }
      >
        {languageDataList.map(({ value, label }) => (
          <Option key={value} value={value} label={label} />
        ))}
      </SelectMultiple>
    </Wrapper>
  );
};

export default LanguagePicker;
