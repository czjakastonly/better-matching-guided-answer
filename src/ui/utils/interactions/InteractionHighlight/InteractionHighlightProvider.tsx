import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useGetWasLastEventTypeKeyboard } from '@ui/providers/LastEventProvider/useGetWasLastEventTypeKeyboard';

/**
 *
 *
 *
 * Interaction HIGHLIGHT
 *
 *
 * A provider whose children of type interactionHighlightItem (created with hook) can be highlighted by the keyboard up/down.
 *
 * How it works:
 *
 * 1)
 * Highlightable children MUST be queryable by native querySelectorAll (see config.ITEM_NODE_QUERY)
 *
 * 2)
 * Highlightable children MUST have their unique uuid stored somehow in dom (see config.ITEM_UUID_ATTR)
 *
 * 3)
 * Children can also have data attribute to prevent it from being highlighted (see config.ITEM_DISABLED_ATTR)
 *
 * 4)
 * On first key down pressed, the first element of the list is highlighted (if nothing highlighted yet)
 *
 * 5)
 * On first key up pressed, the last element of the list is highlighted (if nothing highlighted yet)
 *
 * 6)
 * points 4 and 5 are valid UNLESS we mark prioritized first-highlight child with proper attribute
 * (see config.ITEM_PRIORITIZED_ATTR)
 * This can be useful if we have <ListBox> with selected item and want it to be highlighted first on key pressed
 *
 *
 * 7)
 * Putting attributes on component doesn't make element highlightable.
 * Every interHighlightChild component must be created with useInterHighlightHighlightItem hook (to get isSelected prop)
 *
 * 8)
 * Some sort of container is required as well - for registering keydown + has REF!
 *
 *
 * Check <ListBox> or _shared/interaction.stories for live examples
 *
 *
 *
 */

/**
 * Component configuration. Easy to became a default prop, if config-as-prop will be required
 */
const config = {
  /** html attribute to store uuid of element. Will be used to query it's value */
  ITEM_UUID_ATTR: 'data-h-uuid',
  /** html attribute that will be given "true" if element is disabled */
  ITEM_DISABLED_ATTR: 'data-h-dis',
  /** html attribute that will be given "true" if element is prioritized to be highlighted when time comes (e.g selected item) */
  ITEM_PRIORITIZED_ATTR: 'data-h-pri',
  /** query to find interaction nodes (can use ITEM_UUID_ATTR but don't have to) */
  ITEM_NODE_QUERY: '[data-h-uuid]',
  /** based on the ITEM_UUID_ATTR */
  readUuidFromNode: (node?: Element | null) => {
    return (node as HTMLElement)?.dataset?.hUuid;
  },
  /** based on the ITEM_DISABLED_ATTR */
  readIsEnabledFromNode: (node?: Element | null) => {
    return (node as HTMLElement)?.dataset?.hDis !== 'true';
  },
  /** based on ITEM_PRIORITIZED_ATTR  */
  readIsPrioritizedHighlightFromNode: (node?: Element | null) => {
    return (node as HTMLElement)?.dataset?.hPri === 'true';
  },
} as const;

export const InteractionHighlightItemContext = React.createContext<{
  highlightedUuid: string;
  ITEM_UUID_ATTR: typeof config.ITEM_UUID_ATTR;
  ITEM_DISABLED_ATTR: typeof config.ITEM_DISABLED_ATTR;
  ITEM_PRIORITIZED_ATTR: typeof config.ITEM_PRIORITIZED_ATTR;
} | null>(null);

export const InteractionHighlightContainerContext = React.createContext<{
  highlightedUuid: string;
  containerRef: React.RefObject<HTMLDivElement>;
  handleArrowUpPressed: (e: React.KeyboardEvent) => void;
  handleArrowDownPressed: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
  handleFocus: () => void;
  handleMouseMove: (e: React.MouseEvent) => void;
} | null>(null);

export const InteractionHighlightProvider = ({ children }: { children?: React.ReactNode }) => {
  /*
    Why we need it here?
    Because we need it for the container to query items inside it
    Because we need to keep focus on container to handle arrow up/down event that is highlighting items
  */
  const containerRef = useRef<HTMLDivElement>(null);

  const getWasLastEventTypeKeyboard = useGetWasLastEventTypeKeyboard();

  const [currentHighlightedUuid, setCurrentHighlightedUuid] = useState<string>('');

  /**
   * Returns potential DOM nodes that can be highlighted.
   * Should have them all, but can also contain other node elements that will be ignored further
   */
  const queryInteractionNodeList = useCallback(() => {
    return Array.from(containerRef.current?.querySelectorAll(config.ITEM_NODE_QUERY) || []);
  }, []);

  const highlightUuid = useCallback((uuid: string) => {
    setCurrentHighlightedUuid(uuid);
  }, []);

  /**
   * Returns registered uuid in nodeList starting from some index (included in search)
   * with some direction. Used to find siblings or first/last elements
   */
  const findClosestUuidInNodeList = useCallback(
    ({
      nodeList,
      direction,
      startIndex,
    }: {
      /** array of dom nodes to be iterated */
      nodeList: Array<HTMLElement | undefined>;
      /** iteration starting index */
      startIndex: number;
      /** iteration direction */
      direction: 'previous' | 'next';
    }) => {
      const DELTA = direction === 'next' ? 1 : -1;

      let searchingIndex = Number.isInteger(startIndex) ? startIndex : 0; // ts+eslint freaks out when startIndex defaults = 0

      while (nodeList[searchingIndex]) {
        const nodeUuid = config.readUuidFromNode(nodeList[searchingIndex]);

        if (nodeUuid && config.readIsEnabledFromNode(nodeList[searchingIndex])) {
          return nodeUuid;
        }
        searchingIndex += DELTA;
      }

      return undefined;
    },
    []
  );

  /**
   * Find uuid of element that is marked as prioritizedHighlighted && !disabled.
   * Use case: having dropdown with multiple items "selected" and pressing arrow-up for the first time should highlight the latest
   */
  const findClosestPrioritizedHighlightedUuidInNodeList = useCallback(
    ({
      nodeList,
      direction = 'next',
    }: {
      /** array of dom nodes to be iterated */
      nodeList: Array<HTMLElement | undefined>;
      /** iteration direction */
      direction?: 'previous' | 'next';
    }) => {
      const autoHighlightedUuidList = nodeList
        /* eslint-disable unicorn/no-array-callback-reference */
        .filter(config.readIsPrioritizedHighlightFromNode)
        .filter(config.readIsEnabledFromNode)
        .map(config.readUuidFromNode);
      /* eslint-enable unicorn/no-array-callback-reference */

      return direction === 'next' ? autoHighlightedUuidList.shift() : autoHighlightedUuidList.pop();
    },
    []
  );

  /**
   * Collects data about current highlight state.
   * Performs some checks like if node exists, or if it's registered
   */
  const getCurrentStateMetadata = useCallback(() => {
    // eslint-disable-next-line xss/no-mixed-html
    const interactionNodeList = queryInteractionNodeList() as Array<HTMLDivElement | undefined>;

    const highlightedNodeIndex = currentHighlightedUuid
      ? interactionNodeList.findIndex(rowNode => config.readUuidFromNode(rowNode) === currentHighlightedUuid)
      : -1;
    const highlightedNodeElement = interactionNodeList[highlightedNodeIndex];

    return {
      interactionNodeList,
      highlightedNodeIndex,
      highlightedNodeElement,
    };
  }, [queryInteractionNodeList, currentHighlightedUuid]);

  /**
   * Find uuid of element that should be highlighted next.
   * If currentHighlightedUuid is not set - will try to find prioritized highlighted (and not disabled) element
   * If no prioritized highlighted - will try to find first (not disabled) element in the list
   * If no element in the list - will return undefined
   */
  const findUuidToHighlight = useCallback(
    (direction: 'next' | 'previous') => {
      const { interactionNodeList, highlightedNodeIndex } = getCurrentStateMetadata();
      let newHighlightedUuid: string | undefined;

      if (!currentHighlightedUuid) {
        newHighlightedUuid = findClosestPrioritizedHighlightedUuidInNodeList({
          nodeList: interactionNodeList,
          direction,
        });
      }

      if (!newHighlightedUuid) {
        newHighlightedUuid =
          highlightedNodeIndex === -1
            ? findClosestUuidInNodeList({
                nodeList: interactionNodeList,
                direction,
                startIndex: direction === 'next' ? 0 : interactionNodeList.length - 1,
              })
            : findClosestUuidInNodeList({
                nodeList: interactionNodeList,
                direction,
                startIndex: highlightedNodeIndex + (direction === 'next' ? 1 : -1),
              });
      }

      return newHighlightedUuid;
    },
    [
      getCurrentStateMetadata,
      findClosestUuidInNodeList,
      findClosestPrioritizedHighlightedUuidInNodeList,
      currentHighlightedUuid,
    ]
  );

  /**
   * Keyboard arrow-down pressed - go to next interaction node
   */
  const handleArrowDownPressed = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      const newHighlightedUuid = findUuidToHighlight('next');
      if (newHighlightedUuid) {
        highlightUuid(newHighlightedUuid);
      }
    },
    [findUuidToHighlight, highlightUuid]
  );

  /**
   * keyboard arrow-up pressed - go to previous interaction node
   */
  const handleArrowUpPressed = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      const newHighlightedUuid = findUuidToHighlight('previous');
      if (newHighlightedUuid) {
        highlightUuid(newHighlightedUuid);
      }
    },
    [findUuidToHighlight, highlightUuid]
  );

  /** @experimental - can be used to highlight item on mouse move. Not used yet */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const node = (e.target as HTMLElement).closest(config.ITEM_NODE_QUERY);
      const uuid = config.readUuidFromNode(node);
      if (uuid && config.readIsEnabledFromNode(node)) {
        highlightUuid(uuid);
      } else {
        highlightUuid('');
      }
    },
    [highlightUuid]
  );

  /**
   * Un-highlight element, if container has no more focus inside (doesn't care if its row or something else)
   * This makes sens mainly when used not-in-dropdown
   */
  const handleBlur = useCallback(() => {
    highlightUuid('');
  }, [highlightUuid]);

  /**
   * Highlight element, if container has been focused by keyboard
   */
  const handleFocus = useCallback(() => {
    const wasLastEventTypeKeyboard = getWasLastEventTypeKeyboard();

    if (wasLastEventTypeKeyboard) {
      const newHighlightedUuid = currentHighlightedUuid || findUuidToHighlight('next');

      if (newHighlightedUuid) {
        highlightUuid(newHighlightedUuid);
      }
    }
  }, [findUuidToHighlight, highlightUuid, currentHighlightedUuid, getWasLastEventTypeKeyboard]);

  return (
    <InteractionHighlightContainerContext.Provider
      value={useMemo(
        () => ({
          highlightedUuid: currentHighlightedUuid ?? '',
          handleArrowDownPressed,
          handleArrowUpPressed,
          handleFocus,
          handleBlur,
          handleMouseMove,
          containerRef,
        }),
        [handleBlur, handleArrowDownPressed, handleArrowUpPressed, currentHighlightedUuid, handleMouseMove, handleFocus]
      )}
    >
      <InteractionHighlightItemContext.Provider
        value={useMemo(
          () => ({
            highlightedUuid: currentHighlightedUuid ?? '',
            ITEM_PRIORITIZED_ATTR: config.ITEM_PRIORITIZED_ATTR,
            ITEM_UUID_ATTR: config.ITEM_UUID_ATTR,
            ITEM_DISABLED_ATTR: config.ITEM_DISABLED_ATTR,
          }),
          [currentHighlightedUuid]
        )}
      >
        {children}
      </InteractionHighlightItemContext.Provider>
    </InteractionHighlightContainerContext.Provider>
  );
};
