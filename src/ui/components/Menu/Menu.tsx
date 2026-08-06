import React from 'react';
import type { ForwardedRef } from 'react';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import { Popover } from '@ui/components/Popover';
import { type AllowedClosingKey, useFloatingDropdown } from '@ui/components/Dropdown';
import { generateDialogDomId, generateListboxDomId, useDomId } from '@ui/utils/domId';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { ButtonOutline, type ButtonOutlineProps } from '@ui/components/buttons/ButtonOutline';
import { InteractionHighlightProvider } from '@ui/utils/interactions/InteractionHighlight';
import { InteractionActionProvider } from '@ui/utils/interactions/InteractionAction';

import { type MenuProps, type MenuTriggerMandatoryProps } from './_shared/types';
import { MenuInteractionsContainer } from './_shared/MenuInteractionsContainer';

const CLOSING_KEY_LIST: AllowedClosingKey[] = ['Escape', 'Tab'];

/**
 * Dropdown menu component with all the aria-* attributes handled automatically, and close on action
 * <Menu as={ButtonMinimal} iconOnly={<Icon/>}>
 *   <Action action={console.log} />
 *   <Action...>
 *   <ActionDelete />
 *   Fragments allowed (unlike in select)
 * </Select>
 *
 * handles keyboard, displays search field if number of options is large
 */
export const Menu = React.forwardRef(
  <T extends MenuTriggerMandatoryProps = ButtonOutlineProps, Payload = unknown>(
    {
      as: TriggerComponent = ButtonOutline,
      children,
      id,
      isFlipDisabled,
      minWidthRatio,
      maxHeightPx = 400,
      maxWidthRatio = 0,
      onClose,
      onOpen,
      onAction,
      widthPx,
      placement,
      ...restTriggerProps
    }: MenuProps<T, Payload>,
    forwardedRef: ForwardedRef<HTMLButtonElement>
  ) => {
    const { refs, isOpen, close, triggerProps, floatingProps } = useFloatingDropdown<HTMLButtonElement>({
      mainAxisOffset: 4,
      widthExtendPx: 1,
      minWidthRatio,
      maxWidthRatio,
      onClose,
      widthPx,
      closingKeyList: CLOSING_KEY_LIST,
      isFlipDisabled,
      placement,
      onOpen,
    });
    const triggerRef = useMergeRefs<HTMLButtonElement>(forwardedRef, refs.setReference);

    const domId = useDomId(id);
    const listboxId = generateListboxDomId(domId, isOpen);
    const popoverId = generateDialogDomId(domId, isOpen);

    return (
      <>
        <TriggerComponent
          {...restTriggerProps}
          {...triggerProps}
          ref={triggerRef}
          id={domId}
          className={STATIC_CLASS_NAME.dropdownTrigger}
          aria-haspopup="menu"
          aria-controls={listboxId}
          aria-expanded={isOpen}
        />
        {isOpen && (
          <Popover
            isFocusLocked={false /* if tab pressed, then dropdown will be closed anyway */}
            {...floatingProps}
            role="presentation"
            id={popoverId}
          >
            <InteractionHighlightProvider>
              <InteractionActionProvider defaultAction={onAction} onPostAction={close}>
                <MenuInteractionsContainer
                  id={listboxId}
                  maxHeightPx={maxHeightPx}
                  aria-label={restTriggerProps['aria-label']} // todo @a11y - what if trigger has no label?
                  aria-labelledby={restTriggerProps['aria-labelledby']} // todo @a11y - what if trigger has no label?
                >
                  {children}
                </MenuInteractionsContainer>
              </InteractionActionProvider>
            </InteractionHighlightProvider>
          </Popover>
        )}
      </>
    );
  }
);
