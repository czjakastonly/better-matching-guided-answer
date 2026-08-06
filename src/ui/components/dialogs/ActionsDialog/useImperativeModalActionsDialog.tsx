import { useMemo } from 'react';
import { useImperativeModalWindow } from '@ui/providers/ImperativeModalWindowProvider';
import type { ModalWindowOptions } from '@ui/components/ModalWindow';
import { ActionsDialog } from './ActionsDialog';
import type { ActionsDialogProps } from './ActionsDialog.types';

export const useImperativeModalActionsDialog = () => {
  const { openComponent: openModalWindow, close } = useImperativeModalWindow();

  return useMemo(
    () => ({
      open: <T,>(dialogProps: ActionsDialogProps<T>, modalOptions?: ModalWindowOptions) => {
        openModalWindow({
          component: ActionsDialog,
          componentProps: dialogProps,
          modalWindowOptions: modalOptions,
        });
      },
      close,
    }),
    [openModalWindow, close]
  );
};
