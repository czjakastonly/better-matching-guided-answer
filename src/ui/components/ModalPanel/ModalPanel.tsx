import React from 'react';
import { Portal } from '@ui/utils/Portal';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { FocusLock } from '@ui/utils/FocusLock';
import type { ModalPanelProps } from './ModalPanel.types';
import * as Base from './ModalPanel.styles';
import { ModalPanelCloseButton } from './ModalPanelCloseButton';
import { PanelCloseProvider, usePanelCloseController } from './panelClose';

export const ModalPanel = ({
  children,
  onCloseClick,
  onBackdropClick,
  closePositionTop = '24px',
  closePositionRight = '24px',
}: ModalPanelProps) => {
  const isOpen = !!children;

  // Own the close-guard controller so a panel child can intercept closing (e.g. unsaved-changes
  // dialog) by registering a guard via `usePanelClose`. Every close affordance routes through
  // `requestClose`; with no guard registered it simply runs the callback.
  const closeContext = usePanelCloseController();
  const handleBackdropClick = onBackdropClick ? () => closeContext.requestClose(onBackdropClick) : undefined;

  return (
    <Base.AnimatePresence>
      {isOpen && (
        <Portal>
          <FocusLock>
            <Base.Container>
              <Base.Backdrop className={STATIC_CLASS_NAME.modalBackdrop} onClick={handleBackdropClick} />
              <Base.Body className={STATIC_CLASS_NAME.modal} role="dialog" aria-modal="true">
                {typeof onCloseClick === 'function' && (
                  <ModalPanelCloseButton
                    className={STATIC_CLASS_NAME.modalClose}
                    onClick={() => closeContext.requestClose(onCloseClick)}
                    top={closePositionTop}
                    right={closePositionRight}
                    aria-label="close"
                    tabIndex={0}
                  />
                )}
                <PanelCloseProvider value={closeContext}>{children}</PanelCloseProvider>
              </Base.Body>
            </Base.Container>
          </FocusLock>
        </Portal>
      )}
    </Base.AnimatePresence>
  );
};
