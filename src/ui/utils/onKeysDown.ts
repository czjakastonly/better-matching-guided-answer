import { useEffect, useRef } from 'react';

/**
 * Register global keydown listener for provided key pressed.
 *
 * Provide "condition" boolean to omit registering listeners in some circumstances
 * (e.g. don't register listeners if dropdown is not opened)
 */
export const useOnKeysDown = ({
  eventKeyList,
  callback,
  condition = true,
}: {
  eventKeyList: Array<'Escape' | 'Enter' | 'Tab' | 'ArrowDown' | 'ArrowUp'>;
  callback: (event: KeyboardEvent) => void;
  condition?: boolean;
}) => {
  const cachedCallback = useRef(callback);
  const eventKeyToken = eventKeyList.join('');

  useEffect(() => {
    cachedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (condition) {
      const eventHandler = (event: KeyboardEvent) => {
        if (event.defaultPrevented) {
          return; // already processed
        }

        if ((eventKeyList as string[]).includes(event.key)) {
          cachedCallback.current(event);
        }
      };

      window.addEventListener('keydown', eventHandler, true);

      return () => {
        window.removeEventListener('keydown', eventHandler, true);
      };
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, condition, eventKeyToken]);
};
