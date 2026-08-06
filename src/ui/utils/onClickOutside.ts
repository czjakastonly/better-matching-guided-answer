import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

const hasRefElementEventTargetInside = (ref?: RefObject<HTMLElement | null>, event?: Event): boolean => {
  if (!ref) {
    return false;
  }
  if (!event) {
    return false;
  }
  const { current: element } = ref;
  const { target } = event;

  // eslint-disable-next-line xss/no-mixed-html
  return !!element && !!target && element.contains(target as HTMLElement);
};

export const useOnClickOutside = ({
  elementRef,
  callback,
  exceptionRef,
  condition = true,
}: {
  elementRef: RefObject<HTMLElement | null>;
  exceptionRef: RefObject<HTMLElement | null>;
  callback: (event: Event) => void;
  condition?: boolean;
}) => {
  const cachedCallback = useRef(callback);

  useEffect(() => {
    cachedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (condition) {
      const eventHandler = (event: Event) => {
        const clickedOnRef = hasRefElementEventTargetInside(elementRef, event);
        if (!clickedOnRef) {
          const clickedOnException = hasRefElementEventTargetInside(exceptionRef, event);
          if (!clickedOnException) {
            cachedCallback.current(event);
          }
        }
      };

      document.addEventListener('mousedown', eventHandler);
      document.addEventListener('touchstart', eventHandler);

      return () => {
        document.removeEventListener('mousedown', eventHandler);
        document.removeEventListener('touchstart', eventHandler);
      };
    }
    // else
    return undefined;
  }, [elementRef, exceptionRef, condition]);
};
