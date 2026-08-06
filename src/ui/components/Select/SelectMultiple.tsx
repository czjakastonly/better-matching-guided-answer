import type { ForwardedRef } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import { List, ListSearchInput, ListHeader, ListBody, ListFooter } from '@ui/components/List';
import { withListBox } from '@ui/components/ListBox';
import { Popover } from '@ui/components/Popover';
import { ButtonFieldSelect } from '@ui/components/inputs/components/ButtonFieldSelect';
import { useFloatingDropdown } from '@ui/components/Dropdown';
import styled from 'styled-components';
import { generateListboxDomId, useDomId } from '@ui/utils/domId';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { STATIC_CLASS_NAME } from '@ui/constants';
import type { SelectMultipleProps } from './SelectMultiple.types';
import { ButtonMinimal } from '../buttons/ButtonMinimal';
import { RowFlex } from '../Flex';
import { ButtonPrimary } from '../buttons/ButtonPrimary';
import { findOptionDataInReactChild } from './_shared/helpers';
import { type SelectOptionPayload, type SelectTriggerMandatoryProps } from './_shared/types';

const OPTION_LIST_COUNT_TO_SHOW_AUTOCOMPLETE = 7;

const UnstyledDiv = styled.div`
  outline: none;
`; // I need ListFooter outside of ListBox to allow for regular TAB-press focus on buttons
const UnstyledListBox = withListBox(UnstyledDiv);

const defaultRenderIconLeft = (optionData?: SelectOptionPayload[]) => {
  return optionData?.[0]?.iconLeft;
};

const defaultRenderLabel = (optionData?: SelectOptionPayload[]) => {
  return optionData?.map(opt => opt.label || opt.value).join(', ');
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
 *
 * @TODO Get rid of ListBox if want to apply a11y improvements
 */
export const SelectMultiple = React.forwardRef(
  <T extends SelectTriggerMandatoryProps>(
    {
      as: TriggerComponent = ButtonFieldSelect,
      children,
      filterLogic = defaultFilterLogic,
      id,
      name,
      labelApply = 'Apply',
      labelCancel = 'Cancel',
      maxHeightPx = 400,
      maxWidthRatio = 5,
      onChangeValueList,
      onClose,
      placeholder,
      renderIconLeft = defaultRenderIconLeft,
      renderLabel = defaultRenderLabel,
      valueList,
      widthPx,
      placeholderSearch,
      ...restTriggerProps
    }: SelectMultipleProps<T>,
    forwardedRef: ForwardedRef<HTMLButtonElement>
  ) => {
    const [internalValueList, setInternalValueList] = useState(valueList);
    const [filteringPhrase, setFilteringPhrase] = useState('');

    const { refs, isOpen, close, triggerProps, floatingProps } = useFloatingDropdown<HTMLButtonElement>({
      mainAxisOffset: 4,
      widthExtendPx: 1,
      maxWidthRatio,
      onClose,
      closingKeyList: ['Escape'],
      widthPx,
    });
    const triggerRef = useMergeRefs<HTMLButtonElement>(forwardedRef, refs.setReference);
    const domId = useDomId(id);
    const listboxId = generateListboxDomId(domId, isOpen);

    /**
     * Collect data of selected child.
     * To be displayed in combobox (that means in trigger).
     * it has nothing to do with the options marked as selected or not <-- that is made by ListBox used below
     */

    const selectedOptionPayloadByValue: Record<string, SelectOptionPayload> = {};
    const metadata = {
      isAllSelected: true,
    };

    let optionsCount = 0;
    const filteredChildList = React.Children.toArray(children).filter(child => {
      // filer out only option-like components.
      const optionPayload = findOptionDataInReactChild(child);

      if (optionPayload) {
        optionsCount += 1;
        // use the same traversing for collecting selected option data
        if (valueList.includes(optionPayload.value)) {
          selectedOptionPayloadByValue[optionPayload.value] = {
            value: optionPayload.value,
            iconLeft: optionPayload.iconLeft,
            label: optionPayload.label,
          };
        } else {
          metadata.isAllSelected = false;
        }
        return filterLogic(filteringPhrase, optionPayload);
      }
      return true; // non option-like items pass the filtering
    });

    const handleToggleSelection = useCallback(
      (optionPayload?: SelectOptionPayload) => {
        const optionValue = optionPayload?.value ?? '';
        const newInternalValueList = internalValueList.includes(optionValue)
          ? internalValueList.filter(v => v !== optionValue)
          : [...internalValueList, optionValue];

        setInternalValueList(newInternalValueList);
      },
      [internalValueList]
    );

    const handleApply = useCallback(() => {
      onChangeValueList?.(internalValueList, name);
      close();
    }, [onChangeValueList, internalValueList, close, name]);

    const valuePayloadList = Object.values(selectedOptionPayloadByValue);

    const triggerLabel = renderLabel(valuePayloadList);
    const shouldUsePlaceholderStyling = !triggerLabel;
    const shouldShowAutocomplete = optionsCount >= OPTION_LIST_COUNT_TO_SHOW_AUTOCOMPLETE;

    const valueListToken = valueList.join('');
    useEffect(() => {
      if (isOpen) {
        // why this? Because we don't keep selection state in <Popover> state but kind of in trigger state
        // so it's not remounted
        // TODO consider improving performance by creating separate <SelectMultipleDropdownContent>
        // setInternalValueList(valueList);
        setInternalValueList(valueList);
      }
    }, [isOpen, valueListToken /* valueList not needed because of token */]);

    return (
      <>
        <TriggerComponent
          {...restTriggerProps}
          {...triggerProps}
          className={mergeClassNames(STATIC_CLASS_NAME.dropdownTrigger)}
          id={domId}
          ref={triggerRef}
          aria-controls={listboxId}
          iconLeft={renderIconLeft(valuePayloadList)}
          isPlaceholder={shouldUsePlaceholderStyling}
        >
          {triggerLabel || placeholder || ''}
        </TriggerComponent>
        {isOpen && (
          <Popover isFocusLocked {...floatingProps}>
            <List>
              <UnstyledListBox<SelectOptionPayload>
                onAction={handleToggleSelection}
                value={internalValueList}
                autoFocus={!shouldShowAutocomplete}
                tabIndex={0}
              >
                {shouldShowAutocomplete && (
                  <ListHeader>
                    <ListSearchInput
                      value={filteringPhrase}
                      onChangeValue={setFilteringPhrase}
                      autoFocus={shouldShowAutocomplete}
                      placeholder={placeholderSearch}
                    />
                  </ListHeader>
                )}
                <ListBody style={{ maxHeight: maxHeightPx }}>{filteredChildList}</ListBody>
              </UnstyledListBox>
              <ListFooter>
                <RowFlex justifyContent="space-between" paddingY={1} paddingX={1.5}>
                  <ButtonMinimal size="small" onClick={close} data-action-cancel>
                    {labelCancel}
                  </ButtonMinimal>
                  <ButtonPrimary size="small" onClick={handleApply} data-action-apply>
                    {labelApply}
                  </ButtonPrimary>
                </RowFlex>
              </ListFooter>
            </List>
          </Popover>
        )}
      </>
    );
  }
);
