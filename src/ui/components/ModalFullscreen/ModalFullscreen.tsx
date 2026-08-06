/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Portal } from '@ui/utils/Portal';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { FocusLock } from '@ui/utils/FocusLock';
import useReducedMotion from '@ui/utils/reducedMotion';
import * as Base from './ModalFullscreen.styles';
import { type ModalFullscreenProps } from './ModalFullscreen.types';

export const ModalFullscreen = React.forwardRef<HTMLDivElement, ModalFullscreenProps>(({ children }, forwardedRef) => {
  const reduceMotion = useReducedMotion();

  return (
    <Base.AnimatePresence>
      {!!children && (
        <Portal>
          <FocusLock>
            <Base.Container>
              <Base.Body
                className={STATIC_CLASS_NAME.modalFullscreen}
                aria-modal="true"
                role="dialog"
                ref={forwardedRef}
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.05, pointerEvents: 'none' }}
                animate={{ opacity: 1, scale: 1, pointerEvents: 'all' }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.05, pointerEvents: 'none' }}
                transition={{ type: 'spring' }}
              >
                {children}
              </Base.Body>
            </Base.Container>
          </FocusLock>
        </Portal>
      )}
    </Base.AnimatePresence>
  );
});
