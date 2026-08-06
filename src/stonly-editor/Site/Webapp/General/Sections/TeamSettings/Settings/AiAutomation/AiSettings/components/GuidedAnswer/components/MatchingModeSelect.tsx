import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputSelect } from '@ui/components/inputs/InputSelect';
import { Option } from '@ui/components/Select';
import {
  GUIDED_ANSWER_MATCHING_MODE,
  type GuidedAnswerMatchingModeType,
} from 'stonly-editor/model/aiSource/aiSource.enum';

interface MatchingModeSelectProps {
  matchingMode: GuidedAnswerMatchingModeType;
  onMatchingModeChange: (matchingMode: GuidedAnswerMatchingModeType) => void;
}

export const MatchingModeSelect = ({ matchingMode, onMatchingModeChange }: MatchingModeSelectProps) => {
  const { t } = useTranslation();

  return (
    <InputSelect
      data-cy="matchingModeSelect"
      value={matchingMode}
      onChangeValue={value => onMatchingModeChange(value as GuidedAnswerMatchingModeType)}
      label={t('AiSources.GuidedAnswers.MatchingMode')}
    >
      <Option
        value={GUIDED_ANSWER_MATCHING_MODE.QUERIES}
        label={t('AiSources.GuidedAnswers.MatchingModeQueries')}
        description={t('AiSources.GuidedAnswers.MatchingModeQueriesDescription')}
      />
      <Option
        value={GUIDED_ANSWER_MATCHING_MODE.INTENT}
        label={t('AiSources.GuidedAnswers.MatchingModeIntent')}
        description={t('AiSources.GuidedAnswers.MatchingModeIntentDescription')}
      />
    </InputSelect>
  );
};
