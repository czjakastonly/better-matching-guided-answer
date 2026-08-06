import React, { useCallback, useMemo, useRef } from 'react';
import { isSpaceHandledByTargetEvent } from '@ui/utils/domEvent.helpers';

interface InteractionActionItemContextValue<PayloadType> {
  defaultAction?: (payload: PayloadType, uuid: string) => void;
  setCurrentAction: (action: () => void) => void;
  cleanupCurrentAction: (callback: () => void) => void;
  runCurrentAction: () => void;
}

interface InteractionActionProviderProps<PayloadType = unknown> {
  /** If item (interactionActionItem) does not have own "action" prop, it will be executed with it's payload */
  defaultAction?: (payload: PayloadType, uuid: string) => void;
  /** callback executed without parameter after every action. Useful for example to close dropdown */
  onPostAction?: () => void;
  children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const InteractionActionItemContext = React.createContext<InteractionActionItemContextValue<any> | null>(null);

export const InteractionActionContainerContext = React.createContext<{
  handleEnterPressed: (e: React.KeyboardEvent) => void;
  handleSpacePressed: (e: React.KeyboardEvent) => void;
} | null>(null);

/**
 *
 *
 *
 * Interaction ACTION
 *
 *
 * A provider whose children of type interactionActionItem (created with hook) can have "action"
 * callback that is executed both from click on element AND from keyboard Enter/space pressed
 * (the latter with the help of interactionHighlight)
 *
 *
 * Check <ListBox> or _shared/interaction.stories for live examples
 *
 *
 * Read InteractionActionProviderProps interface comments for params description
 *
 *
 *
 */
export const InteractionActionProvider = <PayloadType,>({
  children,
  defaultAction,
  onPostAction,
}: InteractionActionProviderProps<PayloadType>) => {
  /*
    Why we need it here?
    Because the action is meant to be called both on onClick item and space/enter pressed on container
    PS We don't need it for the container
  */
  const currentActionRef = useRef<(() => void | { preventPostAction: boolean }) | null | undefined>();

  const setCurrentAction = useCallback((action?: (() => void) | null) => {
    currentActionRef.current = action;
  }, []);

  const cleanupCurrentAction = useCallback(callback => {
    if (currentActionRef.current === callback) {
      currentActionRef.current = undefined;
    }
  }, []);

  const runCurrentAction = useCallback(() => {
    const actionResult = currentActionRef.current?.();
    // @mateusz - rethink this. It was used as quick-win for building complex menus but it adds complexity
    if (!actionResult?.preventPostAction) {
      onPostAction?.();
    }
  }, [onPostAction]);

  /**
   * keyboard Enter pressed - trigger current action
   */
  const handleEnterPressed = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      runCurrentAction();
    },
    [runCurrentAction]
  );

  /**
   * keyboard Space pressed- trigger onHighlightedSpacePress on highlighted uuid
   */
  const handleSpacePressed = useCallback(
    (e: React.KeyboardEvent) => {
      e.persist?.();
      if (!isSpaceHandledByTargetEvent(e)) {
        e.preventDefault();
        runCurrentAction();
      }
    },
    [runCurrentAction]
  );

  return (
    <InteractionActionContainerContext.Provider
      value={useMemo(
        () => ({
          handleEnterPressed,
          handleSpacePressed,
        }),
        [handleEnterPressed, handleSpacePressed]
      )}
    >
      <InteractionActionItemContext.Provider
        value={useMemo(
          () =>
            ({
              defaultAction,
              setCurrentAction,
              runCurrentAction,
              cleanupCurrentAction,
            } as InteractionActionItemContextValue<PayloadType>),
          [defaultAction, setCurrentAction, runCurrentAction, cleanupCurrentAction]
        )}
      >
        {children}
      </InteractionActionItemContext.Provider>
    </InteractionActionContainerContext.Provider>
  );
};
