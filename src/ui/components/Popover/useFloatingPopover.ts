import { useCallback, useState } from 'react';
import type { OffsetOptions } from '@floating-ui/react-dom';
import { autoUpdate, flip, hide, offset, shift, useFloating } from '@floating-ui/react-dom';

interface UseFloatingPopoverOptions {
  isInitialOpen?: boolean;
  isFlipDisabled?: boolean;
  strategy?: 'fixed' | 'absolute';
  offset?: OffsetOptions;
  onClose?: () => void;
  onOpen?: () => void;
  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start';
}

export const useFloatingPopover = <T extends HTMLElement>({
  isInitialOpen = false,
  isFlipDisabled = false,
  strategy = 'fixed',
  placement = 'bottom-end',
  offset: offsetValue = 0,
  onClose,
  onOpen,
}: UseFloatingPopoverOptions) => {
  const [isOpen, setIsOpen] = useState(!!isInitialOpen);

  const { refs, floatingStyles, middlewareData } = useFloating<T>({
    strategy,
    whileElementsMounted: autoUpdate,
    placement,
    transform: false,
    open: false,
    middleware: [
      offset(offsetValue),
      flip({
        mainAxis: !isFlipDisabled,
        crossAxis: !isFlipDisabled,
      }),
      shift({ padding: 8, crossAxis: !!isFlipDisabled }),
      hide(),
    ],
  });

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    onClose?.();
    setIsOpen(false);
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
    return !isOpen;
  }, [isOpen, close, open]);

  const style: React.CSSProperties = {
    ...floatingStyles, // x, y, position
    ...(middlewareData.hide?.referenceHidden
      ? { visibility: 'hidden', pointerEvents: 'none' }
      : { visibility: 'visible', pointerEvents: 'all' }),
  };

  return {
    refs,
    style,
    middlewareData,
    isOpen,
    toggle,
    open,
    close,
  };
};
