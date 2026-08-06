import React, { useCallback, useEffect, useRef } from 'react';

import { List, ListBody, ListHeader, ListSearchInput } from '@ui/components/List';
import { useInteractionActionContainer } from '@ui/utils/interactions/InteractionAction';
import { useInteractionHighlightContainer } from '@ui/utils/interactions/InteractionHighlight';
import { useInteractionScrollContainer } from '@ui/utils/interactions/InteractionScroll';
import { useMergeRefs } from '@ui/utils/mergeRefs';

import { generateListboxDomId, useDomId } from '@ui/utils/domId';
import { type SelectInteractionsContainerProps } from './types';

/** Html events and properties for all interactions are merged into one component here */
export const SelectInteractionsContainer = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  id,
  maxHeightPx,
  searchOnChangeValue,
  searchPlaceholder,
  searchValue,
  shouldShowSearch,
}: SelectInteractionsContainerProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchInputDomId = useDomId();
  const listboxDomId = generateListboxDomId(searchInputDomId);

  /*
    interaction: highlighting by keyboard.
  */
  const {
    containerRef: highlightInteractionContainerRef,
    handleArrowDownPressed,
    handleArrowUpPressed,
    handleFocus,
    handleBlur,
    highlightedUuid,
    // @experimental handleMouseMove - can be used to highlight item on mouse move. We probably don't want this
  } = useInteractionHighlightContainer();

  /*
    interaction:scrolling to highlighted element
  */
  const { containerRef: scrollInteractionContainerRef } = useInteractionScrollContainer();

  /*
    interaction: triggering action on keyboard AND/OR mouse click.
  */
  const { handleEnterPressed, handleSpacePressed } = useInteractionActionContainer();

  /**
   * Merged keyboard key down pressing
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        handleArrowDownPressed(e);
      } else if (e.key === 'ArrowUp') {
        handleArrowUpPressed(e);
      } else if (e.key === 'Enter') {
        handleEnterPressed(e);
      } else if (e.key === ' ') {
        handleSpacePressed(e);
      }
    },
    [handleArrowDownPressed, handleArrowUpPressed, handleEnterPressed, handleSpacePressed]
  );

  const ref = useMergeRefs(internalRef, highlightInteractionContainerRef, scrollInteractionContainerRef);

  /*
    if search is not shown, then we ALWAYS want to auto focus on container
  */
  const shouldAutoFocusOnContainer = !shouldShowSearch;

  useEffect(() => {
    if (shouldAutoFocusOnContainer && !internalRef.current?.contains(document.activeElement)) {
      internalRef.current?.focus();
    } else if (!shouldAutoFocusOnContainer && !searchInputRef.current?.contains(document.activeElement)) {
      searchInputRef.current?.focus();
    }
  }, [shouldAutoFocusOnContainer]);

  /*
    listbox VS dialog+combobox+listbox (look at ./SELECT_README.md)
  */
  return shouldShowSearch ? (
    <List
      id={id}
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      ref={ref}
      tabIndex={0}
    >
      <ListHeader>
        <ListSearchInput
          aria-activedescendant={highlightedUuid || undefined}
          aria-autocomplete="list"
          aria-controls={listboxDomId}
          aria-expanded="true"
          aria-haspopup="listbox"
          autoComplete="off"
          autoFocus={false} // focus handling must be in effect because "autoFocus" here would be fired before the container's onFocus is called (what means refs in handleFocus are not ready yet)
          id={searchInputDomId}
          onChangeValue={searchOnChangeValue}
          placeholder={searchPlaceholder}
          ref={searchInputRef}
          role="combobox"
          value={searchValue}
        />
      </ListHeader>
      <ListBody id={listboxDomId} role="listbox" style={{ maxHeight: maxHeightPx }}>
        {children}
      </ListBody>
    </List>
  ) : (
    <List
      aria-activedescendant={highlightedUuid || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      id={id /* not listboxDomId, because it's "aria-controlled" from outside by the trigger */}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      ref={ref}
      role="listbox"
      tabIndex={0}
    >
      <ListBody /* if children directly in List, then scrollbar issues */ style={{ maxHeight: maxHeightPx }}>
        {children}
      </ListBody>
    </List>
  );
};
