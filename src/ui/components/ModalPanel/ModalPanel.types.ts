import type React from 'react';

export interface ModalPanelOptions {
  onCloseClick?: () => void;
  onBackdropClick?: () => void;
  closePositionTop?: string;
  closePositionRight?: string;
}

export type ModalPanelProps = ModalPanelOptions & {
  children: React.ReactNode;
};
