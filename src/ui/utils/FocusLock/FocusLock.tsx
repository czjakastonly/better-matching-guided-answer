import React, { useEffect, useRef } from 'react';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { getIsElementTopFocusLock, handleFocusLockTabPress } from './FocusLock.helpers';

/** Trap the focus inside. If nested, then the later wins. If sibling then it will make shit with tab handling */
export const FocusLock = ({
  children,
  isFocusLocked = true,
}: {
  children: React.ReactNode;
  isFocusLocked?: boolean;
}) => {
  const lockContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocusLocked) {
      const keyDownListener = (event: KeyboardEvent) => {
        if (event.key === 'Tab' && lockContainerRef.current && getIsElementTopFocusLock(lockContainerRef?.current)) {
          handleFocusLockTabPress(lockContainerRef.current, event);
        }
      };

      document.addEventListener('keydown', keyDownListener);

      return () => {
        document.removeEventListener('keydown', keyDownListener);
      };
    }

    return undefined;
  }, [isFocusLocked]);

  return (
    <div className={isFocusLocked ? STATIC_CLASS_NAME.focusLocked : undefined} ref={lockContainerRef}>
      {children}
    </div>
  );
};
