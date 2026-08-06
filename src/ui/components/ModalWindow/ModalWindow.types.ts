import type React from 'react';

export interface ModalWindowOptions {
  onCloseClick?: () => void;
  onBackdropClick?: () => void;
  closePositionTop?: string;
  closePositionRight?: string;
}

export type ModalWindowProps = ModalWindowOptions & {
  children: React.ReactNode;
};
