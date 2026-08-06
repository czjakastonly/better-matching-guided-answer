import { useMemo } from 'react';
import { useImperativeModalWindow } from '@ui/providers/ImperativeModalWindowProvider';
import type { ModalWindowOptions } from '@ui/components/ModalWindow';
import { WarningDialog } from './WarningDialog';
import type { WarningDialogProps } from './WarningDialog.types';

export const useImperativeModalWarningDialog = () => {
  const { openComponent: openModalWindow, close } = useImperativeModalWindow();

  return useMemo(
    () => ({
      open: <T,>(dialogProps: WarningDialogProps<T>, modalOptions?: ModalWindowOptions) => {
        openModalWindow({
          component: WarningDialog,
          componentProps: dialogProps,
          modalWindowOptions: modalOptions,
        });
      },
      close,
    }),
    [openModalWindow, close]
  );
};
