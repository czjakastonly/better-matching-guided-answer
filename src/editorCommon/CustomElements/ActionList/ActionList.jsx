import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Row from '@editorCommon/CustomElements/Row/Row.jsx';
import { defaultScrollStyles } from '@editorCommon/CommonStyledComponents/CustomScrollbar';

const Canvas = styled.ul`
  list-style: none;
  padding: 12px;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  ${defaultScrollStyles};

  ${({ maxHeight }) =>
    maxHeight &&
    css`
      max-height: ${typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight};
    `}
`;

const SpacedRow = styled(Row)`
  padding: 12px;
  outline: none;
  line-height: 16px;
  min-height: 32px;
`;

const Separator = styled.div`
  border-top: 1px solid ${props => props.theme.silver};
  height: 1px;
  margin: 12px -16px 12px -16px;
`;

const Headline = styled.div`
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  padding: 8px 0 8px 8px;
  color: ${props => props.theme.steel};
`;

const ActionList = ({
  options,
  dataCy,
  globalAction = null,
  selectedOption,
  onPostSelect = () => {},
  maxHeight,
  type,
}) => (
  <Canvas hasSelectedOption={selectedOption !== undefined} data-cy={dataCy} maxHeight={maxHeight}>
    {options.map(option => {
      const actionItem = globalAction || option.action;
      let isSelected = false;
      if (typeof selectedOption === 'object') {
        isSelected = JSON.stringify(selectedOption) === JSON.stringify(option.value);
      } else if (selectedOption !== undefined && String(selectedOption) === String(option.value)) {
        isSelected = true;
      }

      let linkToUse = {};
      let onClickToUse = () => {
        onPostSelect();
      };

      if (typeof actionItem === 'string' && actionItem === 'link') {
        linkToUse = option.value;
      } else {
        onClickToUse = () => {
          actionItem(option.value);
          onPostSelect();
        };
      }

      const bulletMedia = option.bulletMedia && option.bulletMedia.length > 0 ? option.bulletMedia : [];
      const bulletMediaSize = option.bulletMediaSize ? option.bulletMediaSize : 24;

      return (
        <div key={option.id}>
          {option.separation && <Separator />}
          {option.headline && <Headline>{option.headline}</Headline>}
          <SpacedRow
            content={option.label}
            subContent={option.subContent}
            tooltip={option.tooltip}
            disabled={option.disabled}
            nextNav={option.nextNav}
            bulletMedia={bulletMedia}
            bulletMediaSize={bulletMediaSize}
            link={linkToUse}
            action={onClickToUse}
            selected={isSelected}
            role={option.role || 'link'}
            tabIndex="0"
            data-cy={dataCy}
            dataStaticValue={option.staticValue}
            type={type}
            added={option.added}
            removed={option.removed}
            modified={option.modified}
            flexAlign={option.flexAlign}
          />
        </div>
      );
    })}
  </Canvas>
);

ActionList.propTypes = {
  options: PropTypes.array,
  globalAction: PropTypes.func,
  selectedOption: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array, PropTypes.number]),
  onPostSelect: PropTypes.func,
  dataCy: PropTypes.string,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.string,
};

export default ActionList;
