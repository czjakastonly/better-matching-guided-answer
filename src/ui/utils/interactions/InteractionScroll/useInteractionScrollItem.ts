import { useContext, useEffect, useMemo } from 'react';
import { InteractionScrollContext } from './InteractionScrollProvider';

export const useInteractionScrollItem = ({
  uuid,
  keepIntoView,
  prioritized,
}: {
  uuid: string;
  keepIntoView?: boolean;
  prioritized?: boolean;
}) => {
  const contextValue = useContext(InteractionScrollContext);

  if (!contextValue) {
    throw new Error('STON.ERROR.MissingContext.InteractionScrollContext');
  }

  const { setUuidToKeepIntoView, ITEM_UUID_ATTR, ITEM_PRIORITIZED_ATTR } = contextValue;

  useEffect(() => {
    if (keepIntoView) {
      setUuidToKeepIntoView(uuid);
    }
  }, [keepIntoView, uuid, setUuidToKeepIntoView]);

  return useMemo(
    () => ({
      uuid, // re-export
      itemDomProps: {
        [ITEM_UUID_ATTR]: uuid,
        ...(prioritized && { [ITEM_PRIORITIZED_ATTR]: true }),
      },
    }),
    [uuid, prioritized, ITEM_PRIORITIZED_ATTR, ITEM_UUID_ATTR]
  );
};
