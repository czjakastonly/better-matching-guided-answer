import React, { forwardRef, memo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';
import useTooltip from '@editorCommon/hooks/useTooltip';
import { onKeyDownToOnClick } from 'helpers/a11y';
import { mergeRefs } from '@stonlyCommons/helpers/arrayManagement';

const Canvas = styled.div`
  display: inline-block;
  outline: none;
  ${({ tooltip }) =>
    tooltip &&
    css`
      position: relative;
    `}
`;

export const IconWrap = styled.span`
  ${({ hasAction }) => hasAction && 'cursor: pointer;'}
  display:flex;
  align-items: center;
  ${({ size }) =>
    size &&
    css`
      width: ${size}px;
      height: ${size}px;
    `}

  & svg path {
    ${({ color }) =>
      color &&
      css`
        fill: ${color};
      `}
  }

  @media not all and (pointer: coarse), (min--moz-device-pixel-ratio: 0) {
    &:hover svg path {
      ${({ colorHover }) =>
        colorHover &&
        css`
          fill: ${colorHover};
        `}
    }
  }
`;

const oldPlacementMap = {
  up: 'top',
  down: 'bottom',
  upleft: 'top-start',
  upright: 'top-end',
  downleft: 'bottom-start',
  downright: 'bottom-end',
  left: 'left',
  right: 'right',
};

const Icon = forwardRef(
  (
    {
      src,
      iconNode,
      tabIndex,
      size,
      color,
      colorHover,
      onClick,
      onMouseDown,
      tooltip = '',
      positionTooltip = 'up',
      widthTooltip,
      forceOpenTooltip,
      className,
      dataCy,
      'aria-expanded': ariaExpanded,
    },
    ref
  ) => {
    const IconNode = iconNode;

    const placementConverted = oldPlacementMap[(positionTooltip || '').toLowerCase()] || positionTooltip;

    const { tooltipElement, setElementToStickToRef, setTooltipVisible } = useTooltip({
      content: tooltip,
      width: widthTooltip,
      placement: placementConverted,
      forceVisible: forceOpenTooltip,
    });

    const onmouseoverAction = tooltip ? () => setTooltipVisible(true) : undefined;
    const onmouseoutAction = tooltip ? () => setTooltipVisible(false) : undefined;

    const onClickProxy = e => {
      if (tooltip) {
        setTooltipVisible(false);
      }
      if (onClick) {
        onClick(e);
      }
      if (onMouseDown) {
        onMouseDown(e);
      }
      if (onmouseoutAction) {
        onmouseoutAction();
      }
    };

    let additionalProps = {};
    if (tooltip) {
      additionalProps = {
        onFocus: onmouseoverAction,
        onMouseOver: onmouseoverAction,
        onBlur: onmouseoutAction,
        onMouseOut: onmouseoutAction,
        role: 'link',
        tabIndex: '-1',
        ref: setElementToStickToRef,
      };
    }
    if (onClick || onMouseDown) {
      additionalProps.onKeyDown = onKeyDownToOnClick(onClickProxy);
      if (onClick) {
        additionalProps.onClick = onClickProxy;
      }
      if (onMouseDown) {
        additionalProps.onMouseDown = onClickProxy;
      }
    }
    return (
      <Canvas
        aria-expanded={ariaExpanded}
        data-cy={dataCy}
        className={className}
        tooltip={tooltip}
        {...additionalProps}
        tabIndex={tabIndex}
        ref={mergeRefs(ref, additionalProps.ref)}
      >
        {iconNode ? (
          <IconWrap
            color={color}
            colorHover={colorHover}
            size={size}
            src={src}
            hasAction={!!onClick || !!onMouseDown}
            data-cy={dataCy ? `${dataCy}-icon` : undefined}
          >
            <IconNode />
          </IconWrap>
        ) : (
          <IconWrap
            color={color}
            colorHover={colorHover}
            size={size}
            hasAction={!!onClick || !!onMouseDown}
            data-cy={dataCy ? `${dataCy}-icon` : undefined}
          >
            <SVG src={src} />
          </IconWrap>
        )}
        {tooltipElement}
      </Canvas>
    );
  }
);

Icon.propTypes = {
  'aria-expanded': PropTypes.bool,
  src: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  colorHover: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
  positionTooltip: PropTypes.oneOf([
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    // other legacy options
    'up',
    'down',
    'upLeft',
    'upRight',
    'downLeft',
    'downRight',
  ]),
  widthTooltip: PropTypes.number,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  forceOpenTooltip: PropTypes.bool,
  className: PropTypes.string,
  dataCy: PropTypes.string,
  iconNode: PropTypes.oneOfType([PropTypes.node, PropTypes.object, PropTypes.func]),
};

export default memo(Icon);
