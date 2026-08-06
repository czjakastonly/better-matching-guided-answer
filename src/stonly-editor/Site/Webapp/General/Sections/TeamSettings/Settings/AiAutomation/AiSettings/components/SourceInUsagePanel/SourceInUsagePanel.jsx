import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import panel from '@editorCommon/HOC/Panel/Panel.jsx';
import CloseButton from '@editorCommon/CustomElements/CloseButton/CloseButton.jsx';
import { ColumnFlex } from '@ui/components/Flex';
import { Notification } from '@ui/components/notifications';
import { AI_SOURCE } from 'stonly-editor/model/aiSource/aiSource.enum';
import SourceElementIsUsedInTable from '../IsUsedInTable/SourceElementIsUsedInTable.container';
import SourceIsUsedInTable from '../IsUsedInTable/SourceIsUsedInTable.container';

const Canvas = styled(ColumnFlex)`
  height: 100%;
  width: 100vw;
  transition: width 0.3s;
  @media screen and (min-width: 620px) {
    width: 480px;
  }
`;

const Title = styled.div`
  ${props => props.theme.typography.h0}
`;

const Content = styled(ColumnFlex)`
  overflow-y: auto;
`;

const SourceInUsagePanel = ({ source, teamId, toggleComponent }) => {
  const { t } = useTranslation();

  return (
    <Canvas paddingY={10}>
      <CloseButton dataCy="closeButton" onClick={toggleComponent} />
      <ColumnFlex marginX={4} gap={4} style={{ minHeight: 'auto' }}>
        <Title hasSubtitle>{t('AiSources.IsUsedIn')}</Title>
        {!!source.usedIn && !source.enabled && source.type !== AI_SOURCE.GUIDED_ANSWER && (
          <Notification severity="warning" data-cy="sourceTip">
            {t('AiSources.IsUsedInWarning')}
          </Notification>
        )}
      </ColumnFlex>
      <Content flexGrow={1}>
        {source.searchSourceElementId ? (
          <SourceElementIsUsedInTable sourceId={source.searchSourceElementId} teamId={teamId} />
        ) : (
          <SourceIsUsedInTable sourceId={source.searchSourceId} teamId={teamId} />
        )}
      </Content>
    </Canvas>
  );
};

SourceInUsagePanel.propTypes = {
  source: PropTypes.object,
  teamId: PropTypes.number,
  toggleComponent: PropTypes.func,
};

export default panel(SourceInUsagePanel, { type: 'auto' });
