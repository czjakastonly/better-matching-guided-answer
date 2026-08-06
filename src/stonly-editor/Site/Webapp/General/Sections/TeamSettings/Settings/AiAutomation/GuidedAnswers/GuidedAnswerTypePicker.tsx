import React from 'react';
import { useTranslation } from 'react-i18next';
import { GUIDED_ANSWER_LAUNCH_MODE } from 'stonly-editor/model/aiSource/aiSource.enum';
import GuideSVG from '@ui/atoms/icons/Guide-16.svg';
import CustomMessageSVG from '@ui/atoms/icons/CustomMessage-16.svg';
import ContentSVG from '@ui/atoms/icons/Content-16.svg';
import AutomaticStepSVG from '@ui/atoms/icons/AutomaticStep-16.svg';
import { IconSvg } from '@ui/utils/IconSvg/IconSvg';
import { color } from '@ui/atoms/colors';
import styled from 'styled-components';
import { FEATURE_FLAG } from 'global';
import useFeatureFlags from '@editorCommon/hooks/useFeatureFlags';
import SettingPicker from '../../Team/_shared/SettingPicker/SettingPicker.jsx';

const PlaceholderIcon = styled(ContentSVG)`
  path {
    fill: ${props => props.theme.color.iconSubtle};
  }
`;

const GuideIcon = styled(GuideSVG)`
  path {
    fill: ${props => props.theme.color.iconActive};
  }
`;

const CustomMessageIcon = styled(CustomMessageSVG)`
  path {
    fill: ${props => props.theme.color.iconActive};
  }
`;

const ContentIcon = styled(ContentSVG)`
  path {
    fill: ${props => props.theme.color.iconActive};
  }
`;

const AutomaticStepIcon = styled(AutomaticStepSVG)`
  path {
    fill: ${props => props.theme.color.iconActive};
  }
`;

interface GuidedAnswerTypePickerProps {
  teamId: number;
  selectedGuideLaunchModeList: string[];
  setSelectedGuideLaunchModeList: (guideLaunchModeList: string[]) => void;
}

const GUIDES_MODE_VALUE = [GUIDED_ANSWER_LAUNCH_MODE.EMBEDDED, GUIDED_ANSWER_LAUNCH_MODE.REDIRECTED].join(',');

export const GuidedAnswerTypePicker = ({
  teamId,
  selectedGuideLaunchModeList,
  setSelectedGuideLaunchModeList,
}: GuidedAnswerTypePickerProps) => {
  const { t } = useTranslation();
  const { getIsFeatureFlagEnabledForTeam } = useFeatureFlags();
  const isBpaFeatureEnabled = getIsFeatureFlagEnabledForTeam(teamId, FEATURE_FLAG.BPA);

  const getSelectedIcon = () => {
    const hasOneSelected = selectedGuideLaunchModeList.length === 1;
    if (hasOneSelected && selectedGuideLaunchModeList[0] === GUIDES_MODE_VALUE) {
      return <GuideIcon />;
    }
    if (hasOneSelected && selectedGuideLaunchModeList[0] === GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE) {
      return <CustomMessageIcon />;
    }
    if (hasOneSelected && selectedGuideLaunchModeList[0] === GUIDED_ANSWER_LAUNCH_MODE.BPA) {
      return <AutomaticStepIcon />;
    }
    return <ContentIcon />;
  };

  const options = [
    {
      value: GUIDES_MODE_VALUE,
      label: t('AiSources.GuidedAnswers.TypeGuides'),
      iconLeft: <IconSvg as={GuideSVG} color={color.iconSubtle} />,
    },
    {
      value: GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE,
      label: t('AiSources.GuidedAnswers.TypeCustomMessages'),
      iconLeft: <IconSvg as={CustomMessageSVG} color={color.iconSubtle} />,
    },
    ...(isBpaFeatureEnabled
      ? [
          {
            value: GUIDED_ANSWER_LAUNCH_MODE.BPA,
            label: t('AiSources.GuidedAnswers.TypeBpa'),
            iconLeft: <IconSvg as={AutomaticStepSVG} color={color.iconSubtle} />,
          },
        ]
      : []),
  ];

  return (
    <SettingPicker
      selectedOptions={selectedGuideLaunchModeList}
      setSelectedOptions={setSelectedGuideLaunchModeList}
      defaultLabel={t('AiSources.GuidedAnswers.TypeAny')}
      placeholderIcon={<PlaceholderIcon />}
      selectedIcon={getSelectedIcon()}
      options={options}
    />
  );
};
