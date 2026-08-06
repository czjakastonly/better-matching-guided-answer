import React, { useMemo } from 'react';
import styled from 'styled-components';
import { RowFlex } from '@ui/components/Flex';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import GuideSVG from '@ui/atoms/icons/Guide-color-12.svg';
import CustomMessageSVG from '@ui/atoms/icons/CustomMessage-12.svg';
import { Tooltip } from '@ui/components/Tooltip';
import WarningSVG from '@ui/atoms/icons/Warning-16.svg';
import { useTextIsOverflowing, textOverflowEllipsisStyle } from '@editorCommon/hooks/useTextIsOverflowing';
import { useTranslation } from 'react-i18next';
import { GUIDED_ANSWER_LAUNCH_MODE, GUIDED_ANSWER_START } from 'stonly-editor/model/aiSource/aiSource.enum';
import { stringToHTML } from '@editorCommon/helpers/htmlHelpers';
import { Column } from '../../aiSources.styles';
import { getGuideTitle } from '../../../../helpers/source.helper';

const MAX_WIDTH = 360;

const StyledColumn = styled(Column)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 8px;
  gap: 4px;
`;

const Name = styled.div`
  white-space: nowrap;
  display: block;
  max-width: ${MAX_WIDTH}px;
  ${props => props.theme.typography.uiElement};
  ${textOverflowEllipsisStyle}
`;

const GroupName = styled.div<{ error?: boolean }>`
  white-space: nowrap;
  display: block;
  max-width: ${MAX_WIDTH - 16}px;
  ${props => props.theme.typography.uiElementSmallStrong};
  color: ${props => (props.error ? props.theme.color.textDanger : props.theme.color.textSubtle)};
  ${textOverflowEllipsisStyle}
`;

const BpaBadge = styled.div`
  flex-shrink: 0;
  padding: 2px 4px;
  border-radius: 4px;
  ${props => props.theme.typography.paragraphSmall}
  color: ${props => props.theme.color.textDefault};
  background: linear-gradient(
    -72deg,
    ${props => props.theme.color.backgroundPinkSubtle},
    ${props => props.theme.color.backgroundPurpleSubtle}
  );
`;

const WarningIcon = styled(WarningSVG)`
  path {
    fill: ${props => props.theme.color.iconPink};
  }
`;

const CustomMessageIcon = styled(CustomMessageSVG)`
  path {
    fill: ${props => props.theme.color.iconDefaultWithText};
  }
`;

interface AnswerColumnProps {
  source: AiSourceModel.GuidedAnswer;
  defaultLanguage: string;
}

const AnswerColumn = ({ source, defaultLanguage }: AnswerColumnProps) => {
  const { textRef: nameRef, isOverflowing: isNameOverflowing } = useTextIsOverflowing();
  const { textRef: guideNameRef, isOverflowing: isGuideNameOverflowing } = useTextIsOverflowing();

  const { guideId, startFromStepId, stepStartType, guideLaunchMode, customMessage = {} } = source.properties;
  const isCustomMessage = guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.CUSTOM_MESSAGE;
  const isBpa = guideLaunchMode === GUIDED_ANSWER_LAUNCH_MODE.BPA;

  const { t } = useTranslation();

  const guideName = guideId ? getGuideTitle({ guideTitle: source.guideTitle, language: defaultLanguage }) : undefined;
  const guideError =
    !isCustomMessage && (!guideId || (stepStartType === GUIDED_ANSWER_START.SPECIFIC_STEP && !startFromStepId));

  const getIcon = () => {
    if (isCustomMessage) {
      return <CustomMessageIcon />;
    }
    if (guideError) {
      return <WarningIcon />;
    }
    return <GuideSVG />;
  };

  const label = useMemo(() => {
    if (isCustomMessage) {
      const messageString = customMessage[defaultLanguage] || Object.values(customMessage)[0];
      const messageHtml = stringToHTML(messageString);
      return messageHtml?.innerText || '';
    }
    if (guideError) {
      return t('AiSources.GuidedAnswers.MissingGuide');
    }
    return guideName;
  }, [isCustomMessage, customMessage, defaultLanguage, guideError, guideName, t]);

  return (
    <StyledColumn data-cy="name">
      <RowFlex alignItems="center" gap={1}>
        <Tooltip content={isNameOverflowing ? source.name : undefined}>
          <Name ref={nameRef} data-cy="sourceName">
            {source.name}
          </Name>
        </Tooltip>
        {isBpa && <BpaBadge data-cy="bpaBadge">BPA</BpaBadge>}
      </RowFlex>

      <RowFlex alignItems="center" gap={0.5}>
        {getIcon()}
        <Tooltip content={isGuideNameOverflowing && !isCustomMessage ? label : undefined}>
          <GroupName ref={guideNameRef} error={guideError} data-cy="sourceGuideName">
            {guideError ? t('AiSources.GuidedAnswers.MissingGuide') : label}
          </GroupName>
        </Tooltip>
      </RowFlex>
    </StyledColumn>
  );
};

export default AnswerColumn;
