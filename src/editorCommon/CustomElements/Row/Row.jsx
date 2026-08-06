import React from 'react';
import styled, { css } from 'styled-components';
import Icon from '@editorCommon/StandardElements/Icon/Icon.jsx';

/**
 * Demo stub of the editor's Row (real one pulls react-router, GuideThumbnail, Avatar).
 * Honors the props ActionList passes: content, subContent, bulletMedia, action, disabled, selected.
 */
const Canvas = styled.li`
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; border-radius: 4px;
  font-size: 14px; color: ${({ theme }) => theme.darkGrey};
  &:hover { background: ${({ theme }) => theme.paleGrey}; }
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4; cursor: default; pointer-events: none;
    `}
  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${theme.paleGrey};
    `}
`;
const Texts = styled.div`display: flex; flex-direction: column; min-width: 0;`;
const Sub = styled.span`font-size: 12px; color: ${({ theme }) => theme.slateGrey};`;

const Row = ({ content, subContent, bulletMedia, action, disabled, selected, className, role, tabIndex, ...rest }) => (
  <Canvas
    className={className}
    role={role}
    tabIndex={tabIndex}
    disabled={disabled}
    selected={selected}
    onClick={disabled ? undefined : action}
    onKeyDown={event => {
      if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        action?.(event);
      }
    }}
    data-cy={rest['data-cy']}
  >
    {bulletMedia && <Icon media={bulletMedia} size="16px" />}
    <Texts>
      <span>{content}</span>
      {subContent && <Sub>{subContent}</Sub>}
    </Texts>
  </Canvas>
);

export default Row;
