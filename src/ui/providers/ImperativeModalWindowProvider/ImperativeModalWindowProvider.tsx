import React, { useCallback, useMemo, useState } from 'react';
import { ModalWindow, type ModalWindowOptions } from '@ui/components/ModalWindow';
import type {
  ImperativeModalWindowData,
  ImperativeModalWindowProviderProps,
  ImperativeModalWindowProviderContextValue,
} from './ImperativeModalWindowProvider.types';

export const ImperativeModalWindowContext = React.createContext<ImperativeModalWindowProviderContextValue | null>(null);

const defaultState: ImperativeModalWindowData = {
  component: undefined,
  componentProps: {},
  modalWindowOptions: {},
};

/**
 * Provider needed if want to have a singleton Modal window to be opened imperatively
 * like open(), close()
 * E.g. on global app level
 */
export const ImperativeModalWindowProvider = ({ children }: ImperativeModalWindowProviderProps) => {
  const [state, setState] = useState(defaultState);

  const openComponent = setState;

  const open = useCallback(
    (content: React.ReactNode, modalWindowOptions?: ModalWindowOptions) => {
      openComponent({
        component: React.Fragment,
        componentProps: { children: content },
        modalWindowOptions: modalWindowOptions || defaultState.modalWindowOptions,
      });
    },
    [openComponent]
  );

  const contextValue = useMemo(
    () => ({
      open,
      openComponent,
      close: () => {
        setState(defaultState);
      },
    }),
    [open, openComponent]
  );

  const ModalContentComponent = state?.component;

  return (
    <ImperativeModalWindowContext.Provider value={contextValue}>
      {children}
      <ModalWindow {...state.modalWindowOptions}>
        {ModalContentComponent && <ModalContentComponent {...state.componentProps} />}
      </ModalWindow>
    </ImperativeModalWindowContext.Provider>
  );
};
