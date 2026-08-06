import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { shift, useFloating, arrow, offset, flip, autoUpdate } from '@floating-ui/react-dom';
import usePortal from 'react-cool-portal';
import { MAX_Z_INDEXES } from 'global';

const TooltipWrap = styled(motion.div)`
  position: absolute;
  z-index: ${MAX_Z_INDEXES.TOOLTIP};
  opacity: 0;
  pointer-events: none;
`;

const Arrow = styled.div`
  z-index: -1;
  /* background: ${props => props.theme.charcoal}; */
  background: ${props => props.theme.darkGrey};

  visibility: hidden;
  position: absolute;
  width: 6px;
  height: 6px;

  &::before {
    position: absolute;
    width: 6px;
    height: 6px;
    background: inherit;
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }
`;

const RoundedShape = styled(motion.div)`
  /* background: ${props => props.theme.charcoal}; */
  background: ${props => props.theme.darkGrey};
  text-align: left;
  padding: 8px 12px;
  color: #fff;
  border-radius: 6px;
  font-size: 11px;
  line-height: 16px;
  font-weight: 700;
  max-width: 240px;
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
`;

function useTooltip({
  content,
  width,
  placement: elementPlacement = 'top',
  fitWidth = false,
  forcePlacement = false,
  forceVisible = false,
  className,
}) {
  const arrowRef = useRef();
  const [visible, setVisible] = useState(false);

  const toggleTooltipVisibility = useCallback(() => setVisible(v => !v), [setVisible]);
  const setTooltipVisible = useCallback(v => setVisible(v), [setVisible]);

  const {
    x,
    y,
    floating,
    strategy,
    update,
    refs,
    placement,
    middlewareData: { arrow: { x: arrowX, y: arrowY, centerOffset = 0 } = {} },
  } = useFloating({
    placement: elementPlacement,
    whileElementsMounted: autoUpdate,
    // strategy: 'fixed',
    middleware: [
      offset(10),
      ...(forcePlacement
        ? []
        : [
            flip({
              fallbackPlacements: ['left', 'right', 'top', 'bottom'],
            }),
          ]),
      shift({ padding: 8 }),
      arrow({ element: arrowRef, padding: 12 }),
    ],
  });

  useEffect(() => {
    if (update) update();
  }, [content, update]);

  const { Portal } = usePortal({ internalShowHide: false });

  const tooltipElement = useMemo(() => {
    const [placementMain, placementSecondary] = placement.split('-');
    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placementMain];

    const isNonCenterSecondaryPlacement = ['start', 'end'].includes(placementSecondary);
    const xOffset = ['bottom', 'top'].includes(placementMain) && isNonCenterSecondaryPlacement ? centerOffset : 0;
    const yOffset = ['left', 'right'].includes(placementMain) && isNonCenterSecondaryPlacement ? centerOffset : 0;

    return (
      <AnimatePresence>
        {(visible || forceVisible) && (
          <Portal>
            <TooltipWrap
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? '' ? y + yOffset : '',
                left: x ?? '' ? x + xOffset : '',
              }}
              initial={{ x: 0, y: 8, opacity: 0 }}
              animate={{ y: 0, x: 0, opacity: 1 }}
              exit={{ x: 0, y: 8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={className}
            >
              <RoundedShape width={width} fitWidth={fitWidth}>
                {content}
              </RoundedShape>
              <Arrow ref={arrowRef} style={{ top: arrowY ?? '', left: arrowX ?? '', [staticSide]: '-3px' }} />
            </TooltipWrap>
          </Portal>
        )}
      </AnimatePresence>
    );
  }, [arrowX, arrowY, content, fitWidth, floating, placement, strategy, visible, forceVisible, width, x, y]);

  return { tooltipElement, setElementToStickToRef: refs.setReference, toggleTooltipVisibility, setTooltipVisible };
}

export default useTooltip;
