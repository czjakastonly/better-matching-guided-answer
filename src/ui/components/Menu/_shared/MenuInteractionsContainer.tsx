import React, { useCallback, useEffect, useRef } from 'react';

import { List, ListBody } from '@ui/components/List';
import { useInteractionActionContainer } from '@ui/utils/interactions/InteractionAction';
import { useInteractionHighlightContainer } from '@ui/utils/interactions/InteractionHighlight';
import { useMergeRefs } from '@ui/utils/mergeRefs';

import { type MenuInteractionsContainerProps } from './types';

/** Html events and properties for all interactions are merged into one component here */
export const MenuInteractionsContainer = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  id,
  maxHeightPx,
}: MenuInteractionsContainerProps) => {
  const internalRef = useRef<HTMLDivElement>(null);

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

  const ref = useMergeRefs(internalRef, highlightInteractionContainerRef);

  useEffect(() => {
    if (!internalRef.current?.contains(document.activeElement)) {
      internalRef.current?.focus();
    }
  }, []);

  return (
    <List
      aria-activedescendant={highlightedUuid || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      id={id}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      ref={ref}
      role="menu"
      tabIndex={0}
    >
      <ListBody style={{ maxHeight: maxHeightPx }}>{children}</ListBody>
    </List>
  );
};
