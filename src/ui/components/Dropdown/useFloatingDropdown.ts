import { useCallback } from 'react';
import { useOnClickOutside } from '@ui/utils/onClickOutside';
import { useOnKeysDown } from '@ui/utils/onKeysDown';
import { useDomElementSize } from '@ui/utils/domElementSize';
import { useFloatingPopover } from '../Popover/useFloatingPopover';
import type { AllowedClosingKey, DropdownFloatingOptions } from './Dropdown.types';
import { getIsElementTopDropdown } from './Dropdown.helpers';

const DEFAULT_CLOSING_KEY_LIST: AllowedClosingKey[] = ['Escape', 'Tab'];

export const useFloatingDropdown = <T extends HTMLElement>({
  isFlipDisabled = false,
  strategy = 'fixed',
  mainAxisOffset = 4,
  widthExtendPx = 1,
  placement = 'bottom-start',
  maxWidthRatio = 1,
  minWidthRatio = 1,
  widthPx,
  onClose,
  onOpen,
  closingKeyList = DEFAULT_CLOSING_KEY_LIST,
}: DropdownFloatingOptions = {}) => {
  const {
    refs,
    style: floatingStyle,
    middlewareData,
    isOpen,
    toggle,
    open,
    close,
  } = useFloatingPopover<T>({
    isInitialOpen: false,
    isFlipDisabled,
    placement,
    strategy,
    offset: { mainAxis: mainAxisOffset, crossAxis: -widthExtendPx },
    onClose,
    onOpen,
  });

  const { width: triggerWidth } = useDomElementSize(refs.reference);

  const widthDelta = widthExtendPx ? widthExtendPx * 2 : 0; // if widthExtendPx, then apply it to both sides

  const maxWidth = triggerWidth && maxWidthRatio ? `${triggerWidth * maxWidthRatio + widthDelta}px` : undefined;
  const minWidth = triggerWidth && minWidthRatio ? `${triggerWidth * minWidthRatio + widthDelta}px` : undefined;
  const width = widthPx ? `${widthPx + widthDelta}px` : undefined;

  const style = { ...floatingStyle, minWidth, maxWidth, width };

  const handleClickOutside = useCallback(() => {
    if (getIsElementTopDropdown(refs.floating.current)) {
      close();
    }
  }, [refs.floating, close]);

  const handleClosingKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!getIsElementTopDropdown(refs.floating.current)) return;
      // Mark Escape as handled so outer listeners can opt out via defaultPrevented.
      // Tab is left propagating intentionally — focus navigation must continue.
      if (e.key === 'Escape') {
        e.preventDefault();
      }
      close();
    },
    [refs.floating, close]
  );

  useOnClickOutside({
    elementRef: refs.floating,
    callback: handleClickOutside,
    exceptionRef: refs.reference, // trigger element is exception because it would close the dropdown on mousedown and then open on mouseup
    condition: isOpen,
  });

  useOnKeysDown({ eventKeyList: closingKeyList, callback: handleClosingKeyDown, condition: isOpen });

  const handleTriggerKeyDown: React.KeyboardEventHandler<HTMLElement> = useCallback(
    e => {
      if (['ArrowDown', ' ', 'Enter'].includes(e.key)) {
        toggle();
        e.preventDefault();
      }
    },
    [toggle]
  );

  return {
    maxWidth,
    minWidth: triggerWidth,
    refs,
    style,
    middlewareData,
    isOpen,
    toggle,
    open,
    close,
    // the same but composed for easy to use form
    triggerProps: {
      onKeyDown: handleTriggerKeyDown,
      onClick: toggle,
      isOpen, // compatible with some hooks/components. Maybe should be removed?
      isPressed: isOpen,
      'aria-expanded': isOpen,
      ref: refs.setReference,
    },
    floatingProps: {
      ref: refs.setFloating,
      style,
    },
  };
};
