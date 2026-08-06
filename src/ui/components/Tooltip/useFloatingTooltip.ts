import { useCallback, useRef, useState } from 'react';
import { arrow, autoUpdate, flip, hide, offset, shift, useFloating } from '@floating-ui/react-dom';
import { delay } from 'lodash';
import { useOnKeysDown } from '@ui/utils/onKeysDown';
import { type FloatingTooltipOptions } from './Tooltip.types';

const ARROW_SIZE = '6px';

const DEFAULT_OFFSET = { mainAxis: 10, crossAxis: 0, alignmentAxis: null };

const negativePlacementForPlacement = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export const useFloatingTooltip = <T extends HTMLElement>({
  isInitialOpen = false,
  isFlipDisabled = false,
  isFocusListenerEnabled = true,
  isHoverListenerEnabled = true,
  strategy = 'absolute',
  placement: preferredPlacement = 'top',
  offset: offsetValue = DEFAULT_OFFSET,
}: FloatingTooltipOptions) => {
  const closeTimeoutRef = useRef<number>();

  const [isOpen, setIsOpen] = useState(!!isInitialOpen);
  const arrowRef = useRef<HTMLDivElement>(null);

  const {
    refs,
    floatingStyles,
    middlewareData,
    placement: finalPlacement,
  } = useFloating<T>({
    strategy,
    whileElementsMounted: autoUpdate,
    placement: preferredPlacement,
    transform: false,
    open: false,
    middleware: [
      offset(offsetValue),
      isFlipDisabled
        ? null
        : flip({
            fallbackPlacements: ['bottom', 'right', 'top', 'left'],
          }),
      shift({ padding: 8, crossAxis: true }),
      arrow({ element: arrowRef, padding: 12 }),
      hide(),
    ],
  });

  function arrowStyle() {
    if (middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow;

      const basePlacement = finalPlacement.split('-')[0] as 'top' | 'left' | 'bottom' | 'right';
      const arrowPlacement = negativePlacementForPlacement[basePlacement];

      return {
        width: ARROW_SIZE,
        height: ARROW_SIZE,
        top: typeof arrowY === 'number' ? `${arrowY}px` : '',
        left: typeof arrowX === 'number' ? `${arrowX}px` : '',
        [arrowPlacement]: `calc(${ARROW_SIZE} / -2)`,
      };
    }
    return {};
  }

  const open = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /* to give hovering on balloon (what triggers mouseLeave from trigger) time to keep tooltip open */
  const delayedClose = useCallback(() => {
    closeTimeoutRef.current = delay(setIsOpen, 100, false);
  }, []);

  useOnKeysDown({ eventKeyList: ['Escape'], callback: close, condition: isOpen });

  const triggerProps = {
    ref: refs.setReference,
    onMouseEnter: isHoverListenerEnabled ? open : undefined,
    onMouseLeave: isHoverListenerEnabled ? delayedClose : undefined,
    onFocus: isFocusListenerEnabled ? open : undefined,
    onBlur: isFocusListenerEnabled ? close : undefined,
  };

  const floatingProps = {
    ref: refs.setFloating,
    style: floatingStyles,
    onMouseEnter: undefined,
    onMouseLeave: undefined,
  };

  const arrowProps = {
    ref: arrowRef,
    style: arrowStyle(),
  };

  return {
    refs,
    middlewareData,
    isOpen,
    open,
    close,
    triggerProps,
    arrowProps,
    floatingProps,
  };
};
