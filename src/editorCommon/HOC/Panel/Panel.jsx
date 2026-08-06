import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';
import { hexToRgb } from 'helpers/colorHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import { defaultScrollStyles } from '@editorCommon/CommonStyledComponents/CustomScrollbar';
import useReducedMotion from '@editorCommon/hooks/useReducedMotion';
import { usePanelCloseController, PanelCloseProvider } from '@ui/components/ModalPanel/panelClose';

export { usePanelClose } from '@ui/components/ModalPanel/panelClose';

const FullScreenLayer = styled(motion.div)`
  height: 100%;
  width: 100%;
  position: ${({ type }) => (type === 'wrapped' ? 'absolute' : 'fixed')};
  z-index: 105;
  ${({ zIndex }) =>
    zIndex &&
    css`
      z-index: ${zIndex - 1};
    `}
  left: 0;
  top: 0;
  background-color: ${({ theme }) =>
    `rgba(${hexToRgb(theme.mainColor).r},${hexToRgb(theme.mainColor).g},${hexToRgb(theme.mainColor).b}, 0.6)`};
`;

const Canvas = styled(motion.div)`
  background: #fff;
  color: ${props => props.theme.darkGrey};
  overflow: auto;
  ${defaultScrollStyles};

  ${({ type }) =>
    type === 'wrapped' &&
    css`
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      & {
        -ms-overflow-style: none;
      }
      & {
        overflow: -moz-scrollbars-none;
      }
    `};

  display: flex;
  flex-direction: column;
  position: ${({ type }) => (type === 'wrapped' ? 'absolute' : 'fixed')};
  top: 0;

  z-index: 106;
  ${({ zIndex }) =>
    zIndex &&
    css`
      z-index: ${zIndex};
    `}
  height: 100%;
  /* transition: width 0.2s; */
  width: 100%;
  will-change: width;

  ${({ type }) =>
    type === 'wrapped' &&
    css`
      @media screen and (min-width: 620px) {
        width: 70%;
      }

      @media screen and (min-width: 900px) {
        width: 50%;
      }
    `}

  ${({ type }) =>
    type === 'auto' &&
    css`
      width: fit-content;
    `}
  ${({ type }) =>
    !['wrapped', 'auto'].includes(type) &&
    css`
      @media screen and (min-width: 620px) {
        width: 500px;
      }
    `}
`;

const positionMap = {
  left: { x: '-100%' },
  right: { x: '100%' },
};

/**
 *
 * @param {React.ReactNode} Component
 * @param {Object} panelOptions - options for the panel.
 * @param {"wrapped" | "global" | "auto"} panelOptions.type
 * @param {string} panelOptions.ariaLabelledBy - aria-labelledby to be added to panel container.
 * @returns
 */
const Panel = (Component, panelOptions = {}) => {
  const { ariaLabelledBy, type } = panelOptions;

  function WrappedPanel(passedProps) {
    const { toggleComponent, className, position = 'right', overrideType, show, zIndex = 106 } = passedProps;
    const reduceMotion = useReducedMotion();

    const contextValue = usePanelCloseController();
    const { requestClose } = contextValue;

    useEffect(() => {
      if (!show) {
        return undefined;
      }

      function shortcutListeners(e) {
        // 27 === ESC
        if (e.keyCode === 27) {
          requestClose(() => toggleComponent(''));
        }
      }

      document.addEventListener('keydown', shortcutListeners);
      return () => document.removeEventListener('keydown', shortcutListeners);
    }, [show, requestClose, toggleComponent]);

    return createPortal(
      <AnimatePresence>
        {show && (
          <React.Fragment key={show}>
            <FullScreenLayer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              zIndex={zIndex}
              type={type || overrideType}
              onClick={() => requestClose(() => toggleComponent('none'))}
            />
            <FocusLock>
              <Canvas
                role="dialog"
                aria-labelledby={ariaLabelledBy}
                initial={reduceMotion ? { opacity: 0 } : positionMap[position]}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : positionMap[position]}
                transition={reduceMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 500, mass: 1, damping: 47 }}
                data-cy="panelCanvas"
                type={type || overrideType}
                style={{ [position]: 0 }}
                className={className}
                zIndex={zIndex}
              >
                <PanelCloseProvider value={contextValue}>
                  <Component {...passedProps} />
                </PanelCloseProvider>
              </Canvas>
            </FocusLock>
          </React.Fragment>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  return WrappedPanel;
};

Panel.propTypes = {
  className: PropTypes.string,
  toggleComponent: PropTypes.func,
  show: PropTypes.bool,
  overrideType: PropTypes.string,
  position: PropTypes.string,
  zIndex: PropTypes.number,
};

export default Panel;
