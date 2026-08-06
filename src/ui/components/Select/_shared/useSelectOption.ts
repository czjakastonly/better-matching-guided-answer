import { useInteractionHighlightItem } from '@ui/utils/interactions/InteractionHighlight';
import { useInteractionActionItem } from '@ui/utils/interactions/InteractionAction';
import { useInteractionSelectItem } from '@ui/utils/interactions/InteractionSelect';
import { useInteractionScrollItem } from '@ui/utils/interactions/InteractionScroll';
import { useDomId } from '@ui/utils/domId';
import type { UseSelectOptionOptions } from './types';

export const useSelectOption = <Payload>({
  uuid: optionalUuid,
  disabled,
  payload,
  value,
}: UseSelectOptionOptions<Payload>) => {
  /*
    For the select option we need to provide DOM "id" to every child.
    We need to provide the same id to the container to keep the aria-activedescendant up to date.
  */
  const domId = useDomId(optionalUuid); // remain the same across rerenders.

  const { isSelected } = useInteractionSelectItem({ uuid: domId, value });

  const { isHighlighted, itemDomProps: highlightDomProps } = useInteractionHighlightItem({
    uuid: domId,
    disabled,
    prioritized: isSelected,
  });

  const { itemDomProps: scrollDomProps } = useInteractionScrollItem({
    uuid: domId,
    keepIntoView: isHighlighted,
    prioritized: isSelected,
  });

  /*
    We use actionInteraction to handle click on option.
    But we don't pass any "action" parameter to it because it should ONLY relay on defaultAction (which is set by Select component)
  */
  const { onClick } = useInteractionActionItem({
    uuid: domId,
    payload,
    disabled,
    isCurrent: isHighlighted,
  });

  return {
    isHighlighted,
    isSelected,
    onClick,
    itemDomProps: {
      ...highlightDomProps,
      ...scrollDomProps,
      'aria-selected': isSelected,
      'aria-disabled': disabled,
      'data-activedescendant': isHighlighted,
      role: 'option',
      id: domId,
    },
  };
};
