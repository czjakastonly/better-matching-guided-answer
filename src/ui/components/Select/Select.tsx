import type { ForwardedRef } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import { Popover } from '@ui/components/Popover';
import { ButtonFieldSelect, type ButtonFieldSelectProps } from '@ui/components/inputs/components/ButtonFieldSelect';
import { type AllowedClosingKey, useFloatingDropdown } from '@ui/components/Dropdown';
import { generateDialogDomId, generateListboxDomId, useDomId } from '@ui/utils/domId';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { InteractionSelectProvider } from '@ui/utils/interactions/InteractionSelect';
import { InteractionScrollProvider } from '@ui/utils/interactions/InteractionScroll';
import { InteractionActionProvider } from '@ui/utils/interactions/InteractionAction';
import { InteractionHighlightProvider } from '@ui/utils/interactions/InteractionHighlight';

import type { SelectProps } from './Select.types';
import { findOptionDataInReactChild } from './_shared/helpers';
import { type SelectOptionPayload, type SelectTriggerMandatoryProps } from './_shared/types';

import { SelectInteractionsContainer } from './_shared/SelectInteractionsContainer';

const OPTION_LIST_COUNT_TO_SHOW_SEARCH = 10;
const CLOSING_KEY_LIST: AllowedClosingKey[] = ['Escape', 'Tab'];

const defaultRenderIconLeft = (optionData?: SelectOptionPayload) => {
  return optionData?.iconLeft;
};

const defaultRenderLabel = (optionData?: SelectOptionPayload) => {
  return optionData?.label || optionData?.value || '';
};

const defaultFilterLogic = (phrase: string, optionData?: SelectOptionPayload) => {
  if (optionData && phrase) {
    const lowerPhrase = phrase.toLowerCase();
    return (
      optionData.label?.toLowerCase().includes(lowerPhrase) ||
      String(optionData.value).toLowerCase().includes(lowerPhrase)
    );
  }
  return true;
};

/**
 * A native-like select component to be used like:
 * <Select...>
 *   <Option.../>
 *   <Option...>
 *   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! no Fragments!
 * </Select>
 *
 * handles keyboard, displays search field if number of options is large
 */
export const Select = React.forwardRef(
  <T extends SelectTriggerMandatoryProps = ButtonFieldSelectProps>(
    {
      as: TriggerComponent = ButtonFieldSelect,
      children,
      filterLogic = defaultFilterLogic,
      id,
      isFlipDisabled,
      minWidthRatio,
      maxHeightPx = 400,
      maxWidthRatio = 1,
      name,
      onChangeValue,
      onClose,
      placeholder,
      placeholderSearch,
      renderIconLeft = defaultRenderIconLeft,
      renderLabel = defaultRenderLabel,
      value,
      widthPx,
      ...restTriggerProps
    }: SelectProps<T>,
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
    });
    const triggerRef = useMergeRefs<HTMLButtonElement>(forwardedRef, refs.setReference);

    const [filteringPhrase, setFilteringPhrase] = useState('');

    const triggerId = useDomId(id);

    let selectedOptionPayload = undefined as unknown as SelectOptionPayload | undefined;
    let optionsCount = 0;

    /**
     * Collect data of selected child.
     * To be displayed in combobox (that means in trigger).
     * @design-system TODO flattenFragments (Symbol.for('react.fragment'))
     */

    const filteredChildList = React.Children.toArray(children).filter(child => {
      // filter out only option-like components.
      const optionPayload = findOptionDataInReactChild(child);

      if (optionPayload) {
        optionsCount += 1;
        // use the same traversing for collecting selected option data
        if (optionPayload.value === value) {
          selectedOptionPayload = {
            value: optionPayload.value,
            iconLeft: optionPayload.iconLeft,
            label: optionPayload.label,
          };
        }
        return filterLogic(filteringPhrase, optionPayload);
      }
      return true; // non option-like items pass the filtering
    });

    const handleSelectionChange = useCallback(
      (payload?: SelectOptionPayload) => {
        const optionValue = payload?.value ?? '';
        onChangeValue?.(optionValue, name);
      },
      [onChangeValue, name]
    );

    const triggerLabel = renderLabel(selectedOptionPayload);
    const shouldUsePlaceholderStyling = !triggerLabel;
    const shouldShowSearch = optionsCount >= OPTION_LIST_COUNT_TO_SHOW_SEARCH;

    /* listbox VS dialog with combobox+listbox (look at ./SELECT_README.md) */
    const containerId = shouldShowSearch
      ? generateDialogDomId(triggerId, isOpen)
      : generateListboxDomId(triggerId, isOpen);
    const containerAriaHasPopup = shouldShowSearch ? 'dialog' : 'listbox';
    /* */

    useEffect(() => {
      if (isOpen) {
        setFilteringPhrase('');
      }
    }, [isOpen]);

    return (
      <>
        <TriggerComponent
          {...restTriggerProps}
          {...triggerProps}
          aria-autocomplete="none"
          aria-controls={containerId}
          aria-expanded={isOpen}
          aria-haspopup={containerAriaHasPopup}
          className={STATIC_CLASS_NAME.dropdownTrigger}
          iconLeft={renderIconLeft(selectedOptionPayload)}
          id={triggerId}
          isPlaceholder={shouldUsePlaceholderStyling}
          ref={triggerRef}
          role="combobox"
        >
          {triggerLabel || placeholder || ''}
        </TriggerComponent>
        {isOpen && (
          <Popover isFocusLocked={false /* if tab pressed, then dropdown will be closed anyway */} {...floatingProps}>
            <InteractionSelectProvider selectedValue={value}>
              <InteractionHighlightProvider>
                <InteractionScrollProvider>
                  <InteractionActionProvider defaultAction={handleSelectionChange} onPostAction={close}>
                    <SelectInteractionsContainer
                      aria-label={restTriggerProps['aria-label']} // todo @a11y - what if trigger has no label?
                      aria-labelledby={restTriggerProps['aria-labelledby']} // todo @a11y - what if trigger has no label?
                      id={containerId}
                      maxHeightPx={maxHeightPx}
                      searchOnChangeValue={setFilteringPhrase}
                      searchPlaceholder={placeholderSearch}
                      searchValue={filteringPhrase}
                      shouldShowSearch={shouldShowSearch}
                    >
                      {filteredChildList}
                    </SelectInteractionsContainer>
                  </InteractionActionProvider>
                </InteractionScrollProvider>
              </InteractionHighlightProvider>
            </InteractionSelectProvider>
          </Popover>
        )}
      </>
    );
  }
);
