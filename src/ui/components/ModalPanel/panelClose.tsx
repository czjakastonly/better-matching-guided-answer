import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

/**
 * A close guard intercepts a close attempt. It receives the `proceedClose` callback that actually
 * closes the panel, and decides whether to call it now (e.g. no unsaved changes) or later (e.g.
 * after the user confirms a "discard changes" dialog).
 */
export type PanelCloseGuard = (proceedClose: () => void) => void;

export interface PanelCloseContextValue {
  /** Route every close affordance (close button, backdrop, ESC, ...) through this. */
  requestClose: (proceedClose: () => void) => void;
  /** A panel child registers its guard here; returns a cleanup to unregister it. */
  registerCloseGuard: (guard: PanelCloseGuard) => () => void;
}

const noopCleanup = () => undefined;

const defaultContextValue: PanelCloseContextValue = {
  requestClose: proceedClose => proceedClose(),
  registerCloseGuard: () => noopCleanup,
};

const PanelCloseContext = createContext<PanelCloseContextValue>(defaultContextValue);

export const usePanelClose = () => useContext(PanelCloseContext);

/**
 * Builds the close-guard controller that unifies "discard changes" behaviour across panels.
 * A panel child registers a guard via `registerCloseGuard`; every close affordance must route
 * through `requestClose` so the guard can intercept the close. `ModalPanel` and the editor
 * `Panel` HOC wire this automatically — use it directly only when building a new panel container.
 */
export const usePanelCloseController = (): PanelCloseContextValue => {
  const closeGuardRef = useRef<PanelCloseGuard | null>(null);

  const registerCloseGuard = useCallback((guard: PanelCloseGuard) => {
    closeGuardRef.current = guard;
    return () => {
      if (closeGuardRef.current === guard) {
        closeGuardRef.current = null;
      }
    };
  }, []);

  const requestClose = useCallback((proceedClose: () => void) => {
    if (closeGuardRef.current) {
      closeGuardRef.current(proceedClose);
    } else {
      proceedClose();
    }
  }, []);

  return useMemo(() => ({ requestClose, registerCloseGuard }), [requestClose, registerCloseGuard]);
};

export const PanelCloseProvider = ({
  value,
  children,
}: {
  value: PanelCloseContextValue;
  children: React.ReactNode;
}) => <PanelCloseContext.Provider value={value}>{children}</PanelCloseContext.Provider>;
