import { useInteractionHighlightItem } from '@ui/utils/interactions/InteractionHighlight';
import { useInteractionActionItem } from '@ui/utils/interactions/InteractionAction';
import { useDomId } from '@ui/utils/domId';
import type { UseMenuActionOptions } from './types';

export const useMenuAction = <Payload>({
  uuid: optionalUuid,
  disabled,
  payload,
  action,
}: UseMenuActionOptions<Payload>) => {
  /*
    For the menu action (option) we need to provide DOM "id" to every child.
    We need to provide the same id to the container to keep the aria-activedescendant up to date.
  */
  const domId = useDomId(optionalUuid); // remain the same across rerenders.

  const { isHighlighted, itemDomProps: highlightDomProps } = useInteractionHighlightItem({
    uuid: domId,
    disabled,
  });

  /*
    We use actionInteraction to handle click on menu item. But it's not necessary to use it here
    because we pass action prop to the menu item.
  */
  const { onClick } = useInteractionActionItem({
    uuid: domId,
    payload,
    disabled,
    isCurrent: isHighlighted,
    action,
  });

  return {
    isHighlighted,
    onClick,
    itemDomProps: {
      ...highlightDomProps,
      'aria-disabled': disabled,
      'data-activedescendant': isHighlighted,
      role: 'menuitem',
      id: domId,
    },
  };
};
