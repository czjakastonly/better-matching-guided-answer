import React from 'react';
import { Portal } from '@ui/utils/Portal';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { FocusLock } from '@ui/utils/FocusLock';
import type { ModalWindowProps } from './ModalWindow.types';
import * as Base from './ModalWindow.styles';
import { ModalWindowCloseButton } from './ModalWindowCloseButton';

export const ModalWindow = ({
  // @design-system TODO - aria, id
  children,
  onCloseClick,
  onBackdropClick,
  closePositionTop = '38px',
  closePositionRight = '32px',
}: ModalWindowProps) => {
  if (typeof onCloseClick === 'function') {
    console.warn('STON: ModalWindow.onCloseClick should be migrated to Dialog closeAction prop'); // tmp @design-system
  }

  return (
    <Base.AnimatePresence>
      {!!children && (
        <Portal>
          <FocusLock>
            <Base.Container className={STATIC_CLASS_NAME.modalContainer}>
              <Base.Backdrop className={STATIC_CLASS_NAME.modalBackdrop} onClick={onBackdropClick} />
              <Base.Body className={STATIC_CLASS_NAME.modal} aria-modal="true">
                {typeof onCloseClick === 'function' && (
                  <ModalWindowCloseButton
                    onClick={onCloseClick}
                    top={closePositionTop}
                    right={closePositionRight}
                    tabIndex={0}
                    aria-label="close"
                  />
                )}
                {children}
              </Base.Body>
            </Base.Container>
          </FocusLock>
        </Portal>
      )}
    </Base.AnimatePresence>
  );
};
