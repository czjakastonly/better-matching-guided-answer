import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { defaultScrollStyles } from '@editorCommon/CommonStyledComponents/CustomScrollbar';

const Canvas = styled.div`
  display: flex;
  flex-direction: column;
  width: 95px;
  height: 100%;
  background-color: white;
  border-right: 1px solid ${({ theme }) => theme.color.borderSubtle};
  flex-shrink: 0;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `}
`;

const RowsWrap = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 8px;
  flex-grow: 1;
  padding: 16px 8px 0px 8px;
  ${defaultScrollStyles};
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
    `}
`;

const MenuItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  list-style-type: none;
  gap: 8px;
  padding: 8px;
  cursor: ${({ disabled }) => (disabled ? 'normal' : 'pointer')};
  color: ${({ theme }) => theme.color.textSubtle};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px;
  border-radius: 4px;
  transition: background-color 0.2s;

  & svg path {
    transition: fill 0.2s;
    fill: ${({ theme }) => theme.color.iconDefaultWithText};
  }

  ${({ disabled, theme }) =>
    disabled &&
    css`
      color: ${theme.color.textPlaceholder};
    `}

  ${({ selected, theme }) =>
    selected &&
    css`
      font-weight: 600;
      background: ${theme.color.backgroundDefaultActive};
      color: ${theme.color.textDefault};
      & svg path {
        fill: ${theme.color.iconActive};
      }
    `}

  &:hover {
    ${({ disabled, selected, theme }) =>
      !disabled &&
      !selected &&
      css`
        background: ${theme.color.backgroundDefaultHover};
        color: ${theme.color.textDefault};
        & svg path {
          fill: ${theme.color.iconDefault};
        }
      `};
  }
`;

const BottomWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid ${({ theme }) => theme.color.borderSubtle};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
    `}
`;

const SubMenuContent = styled.div``;

const SubsectionMenu = ({
  options,
  bottomOptions,
  disabled = false,
  history,
  location,
  bottomContent,
  dataStonlyTrigger,
}) => {
  const { pathname } = location;

  const renderItem = ({ name, link, icon: Icon, slug }) => (
    <MenuItem
      data-stonly-trigger={`menu-item-${slug}`}
      key={name}
      selected={pathname.includes(link)}
      onClick={() => history.push(link)}
      disabled={disabled}
    >
      {Icon && <Icon />}
      <span>{name}</span>
    </MenuItem>
  );

  return (
    <Canvas disabled={disabled} data-cy="subsectionMenu" data-stonly-trigger={dataStonlyTrigger}>
      <RowsWrap data-cy="rowsWrap" disabled={disabled}>
        {options.map(item => renderItem(item))}
      </RowsWrap>
      {bottomOptions?.length > 0 && (
        <BottomWrap disabled={disabled}>{bottomOptions.map(item => renderItem(item))}</BottomWrap>
      )}
      <SubMenuContent menuItemsCount={options.length}>{bottomContent}</SubMenuContent>
    </Canvas>
  );
};

SubsectionMenu.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  bottomOptions: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object,
  location: PropTypes.object,
  disabled: PropTypes.bool,
  bottomContent: PropTypes.node,
  dataStonlyTrigger: PropTypes.string,
};

export default withRouter(SubsectionMenu);
