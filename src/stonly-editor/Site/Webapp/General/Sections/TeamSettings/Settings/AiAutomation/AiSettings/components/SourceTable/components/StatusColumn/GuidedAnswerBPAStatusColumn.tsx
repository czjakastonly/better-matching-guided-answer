import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AI_SOURCE_STATUS } from 'stonly-editor/model/aiSource/aiSource.enum';
import { Column } from '../../aiSources.styles';

interface ActiveColumnProps {
  active?: boolean;
  status?: string;
}

const Canvas = styled.div`
  width: fit-content;
  text-transform: uppercase;
  padding: 2px 4px;
  border-radius: 4px;
  ${props => props.theme.typography.paragraphSmall}
  color: ${props => props.theme.color.textDefaultInverse};
`;

const GuidedAnswerBPAStatusColumn = ({ active, status }: ActiveColumnProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const isError = status === AI_SOURCE_STATUS.FAILED;
  const isProcessing =
    active === undefined ||
    status === undefined ||
    status === AI_SOURCE_STATUS.NEW ||
    status === AI_SOURCE_STATUS.QUEUED ||
    status === AI_SOURCE_STATUS.IN_PROGRESS;

  const getLabel = () => {
    if (isError) {
      return t('AiSources.StatusError');
    }
    if (isProcessing) {
      return t('AiSources.StatusProcessing');
    }
    if (active) {
      return t('AiSources.On');
    }
    return t('AiSources.Off');
  };

  const getColor = () => {
    if (isError) {
      return theme.color.backgroundDanger;
    }
    if (isProcessing) {
      return theme.color.backgroundBlueDefault;
    }
    if (active) {
      return theme.color.backgroundGreenDefault;
    }
    return theme.color.backgroundGrayDefault;
  };

  return (
    <Column data-cy="status">
      <Canvas style={{ backgroundColor: getColor() }}>{getLabel()}</Canvas>
    </Column>
  );
};

export default GuidedAnswerBPAStatusColumn;
