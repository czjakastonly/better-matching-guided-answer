import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tooltip } from '@ui/components/Tooltip';
import WarningSVG from '@ui/atoms/icons/Warning-16.svg';
import { AI_LANGUAGE_DETECTION_STATUS } from 'stonly-editor/model/aiSource/aiSource.enum';
import { Column } from '../../aiSources.styles';
import { getFormattedLanguages } from '../../../../../../Team/_shared/helpers';

const StyledColumn = styled(Column)`
  display: flex;
  align-items: center;
  line-height: normal;
  gap: 8px;
`;

const WarningIcon = styled(WarningSVG)`
  path {
    fill: ${props => props.theme.color.iconAccentYellowSubtle};
  }
`;

interface LanguageColumnProps {
  languageList: string[];
}

const LanguageColumn = ({ languageList }: LanguageColumnProps) => {
  const { t } = useTranslation();

  const hasLanguageUnknown = languageList.includes(AI_LANGUAGE_DETECTION_STATUS.DETECTION_FAILED);

  const { tooltipContent, languageLabel } = useMemo(() => {
    const hasLanguageAwaitingDetection = languageList.includes(AI_LANGUAGE_DETECTION_STATUS.DETECTION_IN_PROGRESS);
    const filteredLanguageList = languageList.filter(
      language =>
        language !== AI_LANGUAGE_DETECTION_STATUS.DETECTION_IN_PROGRESS &&
        language !== AI_LANGUAGE_DETECTION_STATUS.DETECTION_FAILED
    );
    const hasMoreLanguages = filteredLanguageList.length > 2;

    if (hasLanguageAwaitingDetection && languageList.length === 1) {
      return { tooltipContent: t('AiSources.LanguageDetectionInProgress'), languageLabel: '-' };
    }

    if (hasLanguageUnknown && languageList.length === 1) {
      return { tooltipContent: '', languageLabel: '' };
    }

    return {
      tooltipContent: hasMoreLanguages ? getFormattedLanguages(filteredLanguageList) : '',
      languageLabel: hasMoreLanguages
        ? `${getFormattedLanguages(filteredLanguageList.slice(0, 2))} +${filteredLanguageList.length - 2}`
        : getFormattedLanguages(filteredLanguageList),
    };
  }, [languageList, t]);

  return (
    <StyledColumn data-cy="languages">
      {languageLabel && <Tooltip content={tooltipContent}>{languageLabel}</Tooltip>}
      {hasLanguageUnknown && (
        <Tooltip content={t('AiSources.LanguageDetectionFailed')}>
          <WarningIcon />
        </Tooltip>
      )}
    </StyledColumn>
  );
};

export default LanguageColumn;
