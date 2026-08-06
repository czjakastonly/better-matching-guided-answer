import React, { useEffect, useRef } from 'react';

import { Portal } from '@ui/utils/Portal';
import { AnimatePresence } from 'framer-motion';
import { FocusLock } from '@ui/utils/FocusLock';
import * as Base from './Popover.styles';
import type { PopoverProps } from './Popover.types';

/** A component to be displayed in portal - useful for dropdowns, dialogs, menus etc.  */
export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    { style = {}, children, minWidthPx, maxWidthPx, maxHeightPx, isFocusLocked, zIndex, ...restMotionDivProps },
    forwardedRef
  ) => {
    const activeElementBeforeOpenRef = useRef(document.activeElement);

    useEffect(() => {
      return () => {
        // focus back to the element that was focused before mounting the popup.
        // preventScroll avoids the browser scrolling that to the top of the container
        (activeElementBeforeOpenRef?.current as HTMLElement | undefined)?.focus?.({ preventScroll: true });
        activeElementBeforeOpenRef.current = null;
      };
    }, []);

    const appliedStyle = Object.assign(
      style,
      minWidthPx && { minWidth: `${minWidthPx}px` },
      maxWidthPx && { maxWidth: `${maxWidthPx}px` },
      maxHeightPx && { maxHeight: `${maxHeightPx}px` }
    );

    return (
      <AnimatePresence>
        <Portal zIndex={zIndex}>
          <FocusLock isFocusLocked={isFocusLocked}>
            <Base.Container {...restMotionDivProps} ref={forwardedRef} style={appliedStyle}>
              {children}
            </Base.Container>
          </FocusLock>
        </Portal>
      </AnimatePresence>
    );
  }
);
