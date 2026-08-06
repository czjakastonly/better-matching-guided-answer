import { useCallback, useContext, useEffect, useMemo } from 'react';
import { InteractionActionItemContext } from './InteractionActionProvider';

interface InteractionActionItemProps<T = object | string | undefined> {
  /**
   * data that will be passed to item's action or provider's defaultAction
   */
  payload?: T;

  /**
   * item's specific callback to be triggered on click or on container's enter/space pressed if action set as current
   */
  action?: (param?: T, uuid?: string) => void;

  /**
   * mandatory unique identifier. No other meaning
   */
  uuid: string;

  /**
   * is item disabled
   */
  disabled?: boolean;

  /**
   * if true, then it will be called on container Enter/space pressed
   */
  isCurrent?: boolean;
}

/** A hook to build interactionAction item */
export const useInteractionActionItem = <Payload>({
  uuid,
  action,
  payload,
  disabled,
  isCurrent,
}: InteractionActionItemProps<Payload>) => {
  const contextValue = useContext(InteractionActionItemContext);

  if (!contextValue) {
    throw new Error('STON.ERROR.DEV - InteractionActionItemContext accessed without provider');
  }

  const { defaultAction, runCurrentAction, setCurrentAction, cleanupCurrentAction } = contextValue;

  /*
    ItemAction
    Function that will be called by GridContainer's keydown (space/enter) once this item is highlighted
    Additionally it will be executed on item's click. (Check "onClick" method from this file)
  */
  const itemAction = useCallback(() => {
    if (!disabled) {
      // @mateusz - rethink this returning. It is used for "preventPostAction" but it adds complexity
      return (action || defaultAction)?.(payload, uuid);
    }
  }, [action, defaultAction, payload, uuid, disabled]);

  /**
   * Item onClick
   * first sets it's action as GridContainer's current
   * and then execute GridContainer's current action.
   *
   * only if not disabled. Otherwise container's postAction callback would be triggered
   */
  const onClick = useCallback(() => {
    if (!disabled) {
      setCurrentAction(itemAction);
      runCurrentAction();
    }
  }, [setCurrentAction, runCurrentAction, itemAction, disabled]);

  /**
   * Register container's keydown (Enter/space) event if item is highlighted.
   * Cleanups needed because sometimes highlighted item may be filtered out (e.g. on <Select> + filtering)
   */
  useEffect(() => {
    if (isCurrent) {
      setCurrentAction(itemAction);
    }
    return () => {
      cleanupCurrentAction(itemAction);
    };
  }, [isCurrent, setCurrentAction, itemAction, cleanupCurrentAction]);

  return useMemo(
    () => ({
      disabled,
      uuid, // re-export
      onClick,
    }),
    [uuid, onClick, disabled]
  );
};
