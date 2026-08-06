import type { ComponentPropsWithoutRef, ElementType } from 'react';
import type { ModalWindowOptions } from '@ui/components/ModalWindow';

export interface ImperativeModalWindowProviderProps {
  children: React.ReactNode;
}

export interface ImperativeModalWindowData<T extends ElementType = ElementType> {
  component?: T;
  componentProps: ComponentPropsWithoutRef<T>;
  modalWindowOptions?: ModalWindowOptions;
}

export interface ImperativeModalWindowProviderContextValue<T extends ElementType = ElementType> {
  openComponent: (params: ImperativeModalWindowData<T>) => void;
  open: (customContent: React.ReactNode, modalWindowOptions?: ModalWindowOptions) => void;
  close: () => void;
}
