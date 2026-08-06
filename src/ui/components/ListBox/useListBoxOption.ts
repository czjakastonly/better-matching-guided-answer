import { useInteractionHighlightItem } from '@ui/utils/interactions/InteractionHighlight';
import { useInteractionActionItem } from '@ui/utils/interactions/InteractionAction';
import { useInteractionSelectItem } from '@ui/utils/interactions/InteractionSelect';
import { useInteractionScrollItem } from '@ui/utils/interactions/InteractionScroll';
import { useDomId } from '@ui/utils/domId';
import type { UseListBoxOptionOptions } from './ListBox.types';

export const useListBoxOption = <Payload>({
  uuid: optionalUuid,
  action,
  disabled,
  payload,
  value,
}: UseListBoxOptionOptions<Payload>) => {
  /*
    For the listBox option we need to provide DOM "id" to every child.
    We need to provide the same id to the listBox container to keep the aria-activedescendant up to date.
    For this purpose uuid value is used because it is unique and stable across rerenders.
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

  const { onClick } = useInteractionActionItem({
    uuid: domId,
    action,
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
      role: 'option',
      id: domId,
    },
  };
};
