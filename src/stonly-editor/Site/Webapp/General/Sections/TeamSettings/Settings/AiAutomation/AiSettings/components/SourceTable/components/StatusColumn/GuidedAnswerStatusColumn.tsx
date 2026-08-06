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

const GuidedAnswerStatusColumn = ({ active, status }: ActiveColumnProps) => {
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
    if (isProcessing || !active) {
      return t('AiSources.Off');
    }
    return t('AiSources.On');
  };

  const getColor = () => {
    if (isError) {
      return theme.color.backgroundDanger;
    }
    if (isProcessing || !active) {
      return theme.color.backgroundGrayDefault;
    }
    return theme.color.backgroundGreenDefault;
  };

  return (
    <Column data-cy="status">
      <Canvas style={{ backgroundColor: getColor() }}>{getLabel()}</Canvas>
    </Column>
  );
};

export default GuidedAnswerStatusColumn;
