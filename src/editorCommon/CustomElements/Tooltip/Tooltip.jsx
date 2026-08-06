import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useReducedMotion from '@editorCommon/hooks/useReducedMotion';

const Canvas = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 120;
  opacity: 0;
  transition: none !important;
  pointer-events: none;

  ${({ position }) =>
    position.includes('up') &&
    css`
      bottom: calc(100% + 4px);
      left: 50%;
    `};

  ${({ position }) =>
    position === 'top left' &&
    css`
      bottom: calc(100% + 4px);
      left: 0;
    `};

  ${({ position }) =>
    position === 'bottom left' &&
    css`
      bottom: auto;
      top: calc(100% + 4px);
      left: 0;
    `};

  ${({ position }) =>
    position.includes('down') &&
    css`
      top: calc(100% + 4px);
      left: 50%;
    `};

  ${({ position }) =>
    position === 'right' &&
    css`
      left: calc(100% + 16px);
      top: 50%;
    `};

  ${({ position }) =>
    position === 'left' &&
    css`
      right: calc(100% + 16px);
      top: 50%;
    `};

  /* @noflip */
  [dir='rtl'] &&& {
    ${({ position }) =>
      position.includes('up') &&
      css`
        left: auto;
        right: 50%;
      `};

    ${({ position }) =>
      position.includes('down') &&
      css`
        left: auto;
        right: 50%;
      `};
  }
`;

const ShapeWrapper = styled.div`
  ${({ position }) =>
    (position.includes('Left') || position.includes('Right')) &&
    css`
      position: relative;
      width: 100%;
    `};
`;

const colorMap = {
  light: {
    bg: css`
      ${props => props.theme.silver}
    `,
    text: css`
      ${props => props.theme.darkGrey}
    `,
  },
  dark: {
    bg: css`
      ${props => props.theme.darkGrey}
    `,
    text: css`
      ${props => props.theme.white}
    `,
  },
  white: {
    bg: css`
      ${props => props.theme.white}
    `,
    text: css`
      ${props => props.theme.steel}
    `,
  },
  warning: {
    bg: css`
      ${props => props.theme.melon}
    `,
    text: css`
      ${props => props.theme.white}
    `,
  },
};

const RoundedShape = styled.div`
  background: ${({ background }) => colorMap[background].bg};
  text-align: left;
  padding: 8px 12px;
  color: ${({ background }) => colorMap[background].text};
  border-radius: 6px;
  font-size: 11px;
  line-height: 16px;
  font-weight: 700;
  max-width: ${({ width }) => width || '240px'};
  width: max-content;
  word-break: break-word;

  ${({ fitWidth }) =>
    fitWidth &&
    css`
      max-width: 100%;
      width: auto;
    `}

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  transform: ${({ position }) => {
    let yTranslate = '';
    let xTranslate = '';

    if (position.includes('up') && (position.includes('Left') || position.includes('Right'))) {
      yTranslate = 'translateY(-100%)';
    }
    if (position.includes('Left')) {
      xTranslate = 'translateX(-14px)';
    }
    if (position.includes('Right')) {
      xTranslate = 'translateX(-100%)';
    }
    if (position.includes('up') && !position.includes('Left') && !position.includes('Right')) {
      xTranslate = '';
    }
    return `${xTranslate} ${yTranslate}`;
  }};

  ${({ position }) =>
    position.includes('Left') &&
    css`
      position: absolute;
      overflow: visible;
    `};

  ${({ position }) =>
    position.includes('Right') &&
    css`
      position: absolute;
      overflow: visible;
      left: 22px;
    `};

  ${({ background }) =>
    background === 'white' &&
    css`
      box-shadow: 0 4px 12px 0 ${props => props.theme.canvasBox};
    `}
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  z-index: 1;

  ${({ position, background }) =>
    position.includes('up') &&
    css`
      border-top: 4px solid ${colorMap[background].bg};
    `};

  ${({ position, background }) =>
    position.includes('down') &&
    css`
      border-bottom: 4px solid ${colorMap[background].bg};
    `};

  ${({ position, background }) =>
    position === 'right' &&
    css`
      position: absolute;
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: 4px solid ${colorMap[background].bg};
    `};

  ${({ position, background }) =>
    position === 'left' &&
    css`
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 4px solid ${colorMap[background].bg};
    `};
`;

function Tooltip({
  content,
  show,
  position = 'up',
  background = 'dark',
  className,
  width,
  style,
  noArrow = false,
  fitWidth = false,
  transformOverride,
}) {
  const reduceMotion = useReducedMotion();

  const transformStates = useMemo(() => {
    let transforms = {
      initial: { x: '-50%', y: position.includes('down') ? -8 : 8 },
      animate: { x: '-50%', y: 0 },
    };
    if (transformOverride) {
      transforms = transformOverride;
    }
    if (position === 'right') {
      transforms.initial = { x: -8, y: '-50%' };
      transforms.animate = { x: 0, y: '-50%' };
    }
    if (position === 'left') {
      transforms.initial = { x: 8, y: '-50%' };
      transforms.animate = { x: 0, y: '-50%' };
    }
    if (position === 'top left') {
      transforms.initial = { x: 0, y: 8 };
      transforms.animate = { x: 0, y: 0 };
    }
    if (position === 'bottom left') {
      transforms.initial = { x: 0, y: -8 };
      transforms.animate = { x: 0, y: 0 };
    }
    return transforms;
  }, [position, transformOverride]);

  return (
    <AnimatePresence>
      {show && (
        <Canvas
          key={show}
          data-cy="tooltip"
          className={className}
          style={style}
          show={show}
          content={content}
          position={position}
          initial={{ opacity: 0, ...(reduceMotion ? transformStates.animate : transformStates.initial) }}
          animate={{ opacity: 1, ...transformStates.animate }}
          exit={{ opacity: 0, ...(reduceMotion ? transformStates.animate : transformStates.initial) }}
          transition={{ duration: 0.15 }}
        >
          {!noArrow && position.includes('down') && <Arrow position={position} background={background} />}
          {!noArrow && position === 'right' && <Arrow position={position} background={background} />}
          <ShapeWrapper position={position}>
            <RoundedShape
              className="rounded-shape"
              position={position}
              background={background}
              width={width}
              fitWidth={fitWidth}
            >
              {content}
            </RoundedShape>
          </ShapeWrapper>
          {!noArrow && position === 'left' && <Arrow position={position} background={background} />}
          {!noArrow && position.includes('up') && <Arrow position={position} background={background} />}
        </Canvas>
      )}
    </AnimatePresence>
  );
}

Tooltip.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
  show: PropTypes.bool,
  position: PropTypes.string,
  background: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.number,
  style: PropTypes.object,
  noArrow: PropTypes.bool,
  fitWidth: PropTypes.bool,
  transformOverride: PropTypes.object,
};

export default Tooltip;
