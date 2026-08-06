import { useContext, useMemo } from 'react';
import { InteractionHighlightItemContext } from './InteractionHighlightProvider';

export const useInteractionHighlightItem = ({
  uuid,
  disabled,
  prioritized,
}: {
  uuid: string;
  disabled?: boolean;
  prioritized?: boolean;
}) => {
  const contextValue = useContext(InteractionHighlightItemContext);

  if (!contextValue) {
    throw new Error('STON.ERROR.MissingContext.InteractionHighlightItemContext');
  }

  const { highlightedUuid, ITEM_PRIORITIZED_ATTR, ITEM_DISABLED_ATTR, ITEM_UUID_ATTR } = contextValue;

  const isHighlighted = !!uuid && uuid === highlightedUuid;

  return useMemo(
    () => ({
      isHighlighted,
      uuid, // re-export
      itemDomProps: {
        [ITEM_UUID_ATTR]: uuid,
        ...(disabled && { [ITEM_DISABLED_ATTR]: true }),
        ...(prioritized && { [ITEM_PRIORITIZED_ATTR]: true }),
      },
    }),
    [uuid, isHighlighted, prioritized, disabled, ITEM_PRIORITIZED_ATTR, ITEM_DISABLED_ATTR, ITEM_UUID_ATTR]
  );
};
