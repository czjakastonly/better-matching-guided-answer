import React, { createContext, useCallback, useEffect, useMemo, useRef } from 'react';

export const LastEventContext = createContext<
  | {
      getWasLastEventTypeKeyboard: () => boolean;
    }
  | undefined
>(undefined); // let in crash on Editor

/**
 * Track the last event type (keyboard or mouse).
 * Used to e.g highlight element if it was focused by keyboard
 */
export function LastEventProvider({ children }: { children: React.ReactNode }) {
  const wasLastEventTypeKeyboard = useRef(false);

  useEffect(() => {
    const setWasLastEventKeyboard = () => {
      wasLastEventTypeKeyboard.current = true;
    };

    const setWasLastEventTypeNotKeyboard = () => {
      wasLastEventTypeKeyboard.current = false;
    };

    window.addEventListener('keydown', setWasLastEventKeyboard);
    window.addEventListener('mousedown', setWasLastEventTypeNotKeyboard);

    return () => {
      window.removeEventListener('keydown', setWasLastEventKeyboard);
      window.removeEventListener('mousedown', setWasLastEventTypeNotKeyboard);
    };
  }, []);

  const getWasLastEventTypeKeyboard = useCallback(() => {
    return !!wasLastEventTypeKeyboard.current;
  }, []);

  return (
    <LastEventContext.Provider value={useMemo(() => ({ getWasLastEventTypeKeyboard }), [getWasLastEventTypeKeyboard])}>
      {children}
    </LastEventContext.Provider>
  );
}
