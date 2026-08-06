import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

/**
 * Component configuration. Easy to became a default prop, if config-as-prop will be required
 */
const config = {
  /** html attribute to store uuid of element. Will be used to query it's value */
  ITEM_UUID_ATTR: 'data-s-uuid',
  /** query to find interaction nodes (can use ITEM_UUID_ATTR but don't have to) */
  ITEM_NODE_QUERY: '[data-s-uuid]',
  /** html attribute that will be given "true" if element is prioritized to be scrolled into view when time comes (e.g selected item) */
  ITEM_PRIORITIZED_ATTR: 'data-s-pri',
  /** query to find prioritized nodes */
  ITEM_PRIORITIZED_QUERY: '[data-s-pri]',
} as const;

export const InteractionScrollContext = React.createContext<{
  setUuidToKeepIntoView: (uuid?: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  ITEM_UUID_ATTR: typeof config.ITEM_UUID_ATTR;
  ITEM_PRIORITIZED_ATTR: typeof config.ITEM_PRIORITIZED_ATTR;
} | null>(null);

export const InteractionScrollProvider = ({ children }: { children: React.ReactNode }) => {
  /*
    Why we need it here?
    Because we need it for the container to query items inside it
  */
  const containerRef = useRef<HTMLDivElement>(null);
  const [uuidToKeepIntoView, setUuidToKeepIntoView] = useState<string | undefined>('');

  const queryNodeByInteractionUuid = useCallback((uuid: string): Element | undefined => {
    const domQuery = `[${config.ITEM_UUID_ATTR}='${uuid}']${config.ITEM_NODE_QUERY}`;
    const node = containerRef.current?.querySelector(domQuery);

    return node ?? undefined;
  }, []);

  const queryPrioritizedNode = useCallback(() => {
    const node = containerRef.current?.querySelector(config.ITEM_PRIORITIZED_QUERY);
    return node ?? undefined;
  }, []);

  useLayoutEffect(() => {
    // One-time scroll to the first prioritized node (e.g. selected item).
    const node = queryPrioritizedNode();
    node?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
  }, []);

  useLayoutEffect(() => {
    if (uuidToKeepIntoView) {
      const node = queryNodeByInteractionUuid(uuidToKeepIntoView);
      node?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [uuidToKeepIntoView, queryNodeByInteractionUuid]);

  return (
    <InteractionScrollContext.Provider
      value={useMemo(
        () => ({
          setUuidToKeepIntoView,
          containerRef,
          ITEM_UUID_ATTR: config.ITEM_UUID_ATTR,
          ITEM_PRIORITIZED_ATTR: config.ITEM_PRIORITIZED_ATTR,
        }),
        [setUuidToKeepIntoView]
      )}
    >
      {children}
    </InteractionScrollContext.Provider>
  );
};
