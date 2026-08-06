import { useContext, useMemo } from 'react';
import { ImperativeModalWindowContext } from './ImperativeModalWindowProvider';

export function useImperativeModalWindow() {
  const modalControls = useContext(ImperativeModalWindowContext);

  if (!modalControls) {
    throw new Error('useImperativeModalWindow requires <ImperativeModalWindowProvider>');
  }

  const { open, close, openComponent } = modalControls;

  return useMemo(
    () => ({
      open,
      openComponent,
      close,
    }),
    [open, close, openComponent]
  );
}
