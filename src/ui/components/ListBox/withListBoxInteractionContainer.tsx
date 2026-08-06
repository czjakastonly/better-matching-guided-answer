import { useInteractionActionContainer } from '@ui/utils/interactions/InteractionAction';
import { useInteractionHighlightContainer } from '@ui/utils/interactions/InteractionHighlight';
import { useMergeRefs } from '@ui/utils/mergeRefs';
import React, { useCallback, useEffect, useRef } from 'react';

import { useInteractionScrollContainer } from '@ui/utils/interactions/InteractionScroll';
import type { ListBoxInteractionContainerInternalProps, ListBoxInteractionContainerProps } from './ListBox.types';

/**
 * Builds a component that is a container for all ListBox's interactions.
 * By container we mean html element that has all the keyboard/focus handlers registered.
 */
export function withListBoxInteractionContainer<
  T extends ListBoxInteractionContainerInternalProps = ListBoxInteractionContainerInternalProps
>(ContainerComponent: React.ComponentType<T>) {
  //

  /**
   * ListBoxInteractionContainer component with all the events attached
   */
  return React.forwardRef<
    HTMLDivElement,
    ListBoxInteractionContainerProps & Omit<T, keyof ListBoxInteractionContainerInternalProps>
  >(({ autoFocus, children, tabIndex = 0, ...restRenderContainerComponentProps }, forwardedRef) => {
    const internalContainerRef = useRef<HTMLDivElement>(null);

    const {
      containerRef: highlightInteractionContainerRef,
      handleArrowDownPressed,
      handleArrowUpPressed,
      handleFocus,
      handleBlur,
      highlightedUuid,
    } = useInteractionHighlightContainer();

    const { containerRef: scrollInteractionContainerRef } = useInteractionScrollContainer();

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

    const ref = useMergeRefs(
      internalContainerRef,
      forwardedRef,
      highlightInteractionContainerRef,
      scrollInteractionContainerRef
    );

    useEffect(() => {
      if (autoFocus && !internalContainerRef.current?.contains(document.activeElement)) {
        internalContainerRef.current?.focus();
      }
    }, [autoFocus]);

    // eslint-disable-next-line sonarjs/no-inverted-boolean-check
    if (!(Number(tabIndex) >= -1)) {
      /* Just in case because the issue is hard to find */
      throw new Error(`STON.ERROR.DEV - invalid ListBoxInteractionContainer tabIndex = [${JSON.stringify(tabIndex)}]`);
    }

    return (
      <ContainerComponent
        /*
              assertion is needed because of a current bug in TS
              https://github.com/Microsoft/TypeScript/issues/28938#issuecomment-450636046
          */
        {...(restRenderContainerComponentProps as T)}
        ref={ref /* this is mandatory to search for highlighting */}
        tabIndex={tabIndex /* this is mandatory to handle div's keydown */}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-activedescendant={highlightedUuid}
      >
        {children}
      </ContainerComponent>
    );
  });
}
