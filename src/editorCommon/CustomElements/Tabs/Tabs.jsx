import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled, { css, useTheme } from 'styled-components';
import PropTypes from 'prop-types';
import { defaultScrollStyles } from '@editorCommon/CommonStyledComponents/CustomScrollbar';

const Canvas = styled.div`
  margin-bottom: 40px;
`;

const TabSwitcher = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 20px;
  box-shadow: inset 0px -1px 0px 0px ${props => props.theme.grey};
  overflow-x: auto;
  ${defaultScrollStyles};

  ${({ hasNoDivider }) =>
    hasNoDivider &&
    css`
      box-shadow: none;
    `}
`;

const Icon = styled.div`
  margin-right: 8px;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    path {
      ${({ iconFillMode }) => iconFillMode}: ${props => props.theme.lightGrey};
      transition: ${({ iconFillMode }) => iconFillMode} 0.2s;
    }
  }
`;

const Label = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  white-space: nowrap;
  color: ${props => props.theme.slateGrey};
  transition: color 0.2s;
`;

const Tab = styled.div`
  display: flex;
  padding: 12px;
  margin-left: 12px;
  margin-right: 12px;
  cursor: pointer;

  ${({ active, color, theme }) =>
    active &&
    css`
      ${Icon} svg path {
        ${({ iconFillMode }) => iconFillMode}: ${color || theme.slateGrey};
      }

      ${Label} {
        color: ${props => props.theme.darkGrey};
      }
    `}

  &:hover > ${Label} {
    color: ${props => props.theme.darkGrey};
  }
`;

const ActiveBar = styled.div`
  position: absolute;
  bottom: 0;
  height: 3px;
  will-change: width;
  transition: background-color 0.2s, width 0.2s, transform 0.2s;
  transition-timing-function: ease-in-out;
  background-color: ${({ color }) => color};
  transform: ${({ left }) => `translate3d(${left}px, 0, 0)`};
  width: ${({ width }) => width}px;
`;

const Tabs = ({ className, tabs = [], activeTabId, onClick, hasNoDivider = false }) => {
  const theme = useTheme();
  const DEFAULT_COLOR = theme.seaweed;
  const DEFAULT_COLOR_FILL_MODE = 'fill';

  const [currentTabId, setCurrentTabId] = useState(activeTabId || tabs[0]?.id);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const [currentTabLeft, setCurrentTabLeft] = useState(0);
  const tabsRef = React.useRef(null);

  function onClickProxy(id) {
    if (onClick) onClick(id);
    setCurrentTabId(id);
  }

  const setCurrentTabMeta = useCallback(() => {
    const tabsNode = tabsRef.current;
    if (tabsNode) {
      const currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);
      const tabNode = tabsNode.children[currentTabIndex];
      if (tabNode) {
        const { left: tabsNodeLeft } = tabsNode.getBoundingClientRect();
        const { left, width } = tabNode.getBoundingClientRect();
        setCurrentTabWidth(width);
        setCurrentTabLeft(left - tabsNodeLeft);
      }
    }
  }, [tabs, currentTabId]);

  useEffect(() => {
    setCurrentTabMeta();
  }, [setCurrentTabMeta]);

  const currentTab = useMemo(() => tabs.find(tab => tab.id === currentTabId) || {}, [currentTabId, tabs]);

  return (
    <Canvas className={className}>
      <TabSwitcher ref={tabsRef} className="tabSwitcher" hasNoDivider={hasNoDivider}>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            onClick={() => onClickProxy(tab.id)}
            active={currentTabId === tab.id}
            color={tab.color}
            iconFillMode={tab.iconFillMode || DEFAULT_COLOR_FILL_MODE}
          >
            {tab.icon && <Icon iconFillMode={tab.iconFillMode}>{tab.icon}</Icon>}
            <Label data-cy="tabLabel">{tab.label}</Label>
          </Tab>
        ))}
        <ActiveBar color={currentTab.color || DEFAULT_COLOR} left={currentTabLeft} width={currentTabWidth} />
      </TabSwitcher>
      {currentTab.content}
    </Canvas>
  );
};

Tabs.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func, PropTypes.node]),
      icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.node]),
      iconFillMode: PropTypes.oneOf(['stroke', 'fill']),
      color: PropTypes.string,
    })
  ).isRequired,
  activeTabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hasNoDivider: PropTypes.bool,
};

export default Tabs;
