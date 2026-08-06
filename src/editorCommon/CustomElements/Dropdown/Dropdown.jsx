import React, {
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useContext,
} from 'react';
import usePortal from 'react-cool-portal';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useFloating, shift, flip, offset, hide, autoUpdate } from '@floating-ui/react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DropdownTriggerWrapIconSVG from 'icons/downPickerDark.svg';
import { onKeyDownToOnClick } from 'helpers/a11y';
import useReducedMotion from '@editorCommon/hooks/useReducedMotion';
import fullscreenContext from '@editorCommon/Contexts/fullscreenContext';
import { getEnsuredElementId } from 'helpers/dom.helpers';

const Canvas = styled.div`
  position: relative;

  &:focus-within .dropdownInputWrap {
    outline: none;
  }
  body.navigating-with-keyboard &:focus-within .dropdownInputWrap {
    box-shadow: 0px 0px 0px 2px ${props => props.theme.white}, 0px 0px 0px 4px ${props => props.theme.darkBlue};
  }
`;

const DropdownCanvas = styled(motion.div)`
  z-index: 1050;
  width: ${({ width }) => (width && typeof width === 'number' ? `${width}px` : width)};
  transition: min-width 0.2s, width 0.2s;
  will-change: width, min-width;
  background: ${props => props.theme.white};
  color: ${props => props.theme.slateGrey};
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 6px 24px 0 rgba(0, 0, 0, 0.16);
`;

const DropdownTriggerWrapCanvas = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const DropdownTriggerWrapChildWrap = styled.div``;

const DropdownTriggerWrapIcon = styled(DropdownTriggerWrapIconSVG)`
  margin-left: 4px;
  path {
    fill: ${props => props.theme.slateGrey};
  }
`;

const TriggerWrap = styled.span`
  display: inline;
  box-shadow: none;
`;

export const DropdownTriggerWrap = ({ children, className }) => (
  <DropdownTriggerWrapCanvas className={className}>
    <DropdownTriggerWrapChildWrap>{children}</DropdownTriggerWrapChildWrap>
    <DropdownTriggerWrapIcon />
  </DropdownTriggerWrapCanvas>
);
DropdownTriggerWrap.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func, PropTypes.node]),
  className: PropTypes.string,
};

const Dropdown = forwardRef(
  (
    {
      triggerId,
      children,
      trigger,
      width,
      placement = 'bottom',
      offsetValue = 0,
      className,
      dataCy,
      disabled,
      notFocusable, // not used
      onClose,
      onOpen,
      isFlipDisabled = false,
      invalid,
      floatingPlacementStrategy = 'fixed', // "absolute" used only in player
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();
    const { parentIsFullscreen, parentCanvasRef } = useContext(fullscreenContext);
    const fullScreenParentId = getEnsuredElementId(parentCanvasRef?.current);

    const {
      x: floatingX,
      y: floatingY,
      strategy: floatingStrategy,
      update: updateFloating,
      refs,
      middlewareData,
    } = useFloating({
      strategy: floatingPlacementStrategy,
      whileElementsMounted: autoUpdate,
      placement,
      middleware: [
        offset(offsetValue),
        flip({
          mainAxis: !isFlipDisabled,
          crossAxis: !isFlipDisabled,
        }),
        shift({ padding: 8, crossAxis: true }),
        hide(),
      ],
    });

    const {
      Portal,
      hide: closePortal,
      isShow: isPortalShow,
      toggle: togglePortal,
      show: showPortal,
    } = usePortal({
      defaultShow: false,
      internalShowHide: false,
      containerId: parentIsFullscreen && fullScreenParentId ? fullScreenParentId : undefined,
      onShow: () => {
        showPortal();
        if (onOpen) {
          onOpen();
        }
        if (!isPortalShow && refs.reference.current) refs.reference.current.focus();
      },
      onHide: () => {
        closePortal();
        if (onClose) onClose();
      },
    });

    const toggleDropdown = useCallback(
      e => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        togglePortal();
      },
      [togglePortal]
    );

    const onClick = useCallback(
      e => {
        if (!disabled) toggleDropdown(e);
      },
      [disabled, toggleDropdown]
    );

    useImperativeHandle(
      ref,
      () => ({
        closeDropdown: () => closePortal(),
        toggleDropdown: () => toggleDropdown(),
        updateDropdownPlacement: () => updateFloating(),
      }),
      [closePortal, toggleDropdown, updateFloating]
    );

    return (
      <Canvas
        data-cy={dataCy}
        className="dropdownCanvas"
        aria-invalid={invalid}
        aria-errormessage={invalid && triggerId ? `status-message-${triggerId}` : undefined}
      >
        <TriggerWrap
          id={triggerId}
          className="triggerWrap"
          tabIndex={notFocusable ? -1 : 0}
          onKeyDown={onKeyDownToOnClick(onClick)}
          onClick={onClick}
          role="button"
          ref={refs.setReference}
        >
          {isValidElement(trigger) ? cloneElement(trigger, { invalid, 'aria-expanded': !!isPortalShow }) : trigger}
        </TriggerWrap>
        <AnimatePresence>
          {isPortalShow && (
            <Portal>
              <DropdownCanvas
                data-cy="dropdownCanvasElement"
                initial={{
                  opacity: 0,
                  pointerEvents: 'none',
                  transform: reducedMotion
                    ? 'none'
                    : `translate3d(0, ${placement.includes('bottom') ? '-' : ''}10px, 0)`,
                }}
                animate={{
                  opacity: 1,
                  pointerEvents: 'all',
                  transform: reducedMotion ? 'none' : `translate3d(0, 0px, 0)`,
                }}
                exit={{
                  opacity: 0,
                  transform: reducedMotion
                    ? 'none'
                    : `translate3d(0, ${placement.includes('bottom') ? '-' : ''}10px, 0)`,
                  pointerEvents: 'none',
                }}
                transition={{ duration: 0.25 }}
                key={isPortalShow}
                ref={refs.setFloating}
                className={className}
                width={width}
                style={{
                  position: floatingStrategy,
                  top: floatingY ?? '',
                  left: floatingX ?? '',
                  visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
                  pointerEvents: middlewareData.hide?.referenceHidden ? 'none' : 'all',
                }}
              >
                {children}
              </DropdownCanvas>
            </Portal>
          )}
        </AnimatePresence>
      </Canvas>
    );
  }
);

Dropdown.propTypes = {
  triggerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func, PropTypes.node]),
  trigger: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func, PropTypes.node]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placement: PropTypes.string,
  className: PropTypes.string,
  dataCy: PropTypes.string,
  disabled: PropTypes.bool,
  notFocusable: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  offsetValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ crossAxis: PropTypes.number, mainAxis: PropTypes.number }),
  ]),
  isFlipDisabled: PropTypes.bool,
  invalid: PropTypes.bool,
  floatingPlacementStrategy: PropTypes.string,
};

export default memo(Dropdown);
