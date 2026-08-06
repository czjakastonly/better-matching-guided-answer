import type { ForwardedRef } from 'react';
import React, { useImperativeHandle, useMemo, useRef } from 'react';
import { useMergeRefs } from '@ui/utils/mergeRefs';
import { Popover } from '@ui/components/Popover';
import { generateDialogDomId, useDomId } from '@ui/utils/domId';
import type { FloatingDropdownHandles, DropdownProps, DropdownTriggerMandatoryProps } from './Dropdown.types';
import { ButtonFieldSelect } from '../inputs/components/ButtonFieldSelect';
import { useFloatingDropdown } from './useFloatingDropdown';
import { DropdownContext } from './DropdownContext';

export const Dropdown = React.forwardRef(
  <T extends DropdownTriggerMandatoryProps>(
    {
      as: TriggerComponent = ButtonFieldSelect,
      children,
      closingKeyList,
      id,
      isFlipDisabled,
      isFocusLocked,
      maxWidthRatio,
      minWidthRatio,
      widthPx,
      mainAxisOffset,
      widthExtendPx,
      onClose,
      onOpen,
      placement,
      strategy,
      ...restTriggerProps
    }: DropdownProps<T>,
    forwardedRef: ForwardedRef<FloatingDropdownHandles>
  ) => {
    const { isOpen, triggerProps, floatingProps, open, close, refs } = useFloatingDropdown({
      isFlipDisabled,
      strategy,
      mainAxisOffset,
      widthExtendPx,
      maxWidthRatio,
      minWidthRatio,
      onClose,
      onOpen,
      closingKeyList,
      placement,
    });

    const triggerInternalRef = useRef<HTMLButtonElement>(null);
    const triggerRef = useMergeRefs<HTMLButtonElement>(triggerInternalRef, refs.setReference);

    const triggerId = useDomId(id);
    const popoverId = generateDialogDomId(triggerId, isOpen);

    useImperativeHandle(
      forwardedRef,
      () => ({
        close,
        focus: () => {
          triggerInternalRef.current?.focus();
        },
        getBoundingClientRect: () => {
          const domRect = triggerInternalRef.current?.getBoundingClientRect();
          if (!domRect) {
            // let it crash if provided trigger cannot handle refs
            throw new Error(
              'STON:ERR: did you pass proper trigger ("as" property) to <FloatingDropdown> component? Does it handle ref?'
            );
          }
          return domRect;
        },
        open,
        isOpen,
      }),
      [close, open, isOpen]
    );

    return (
      <DropdownContext.Provider value={useMemo(() => ({ close, open }), [close, open])}>
        <TriggerComponent
          {...restTriggerProps}
          {...triggerProps}
          id={triggerId}
          ref={triggerRef}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={popoverId}
        />
        {isOpen && (
          <Popover
            {...floatingProps}
            isFocusLocked={isFocusLocked}
            minWidthPx={widthPx}
            maxWidthPx={widthPx}
            role="dialog"
            id={popoverId}
          >
            {children}
          </Popover>
        )}
      </DropdownContext.Provider>
    );
  }
);
