import React from 'react';
import { useListBoxOption } from './useListBoxOption';
import type { ListBoxOptionInternalProps, ListBoxOptionProps } from './ListBox.types';

export function withListBoxOption<T extends ListBoxOptionInternalProps = ListBoxOptionInternalProps>(
  ListItemComponent: React.ComponentType<T>
) {
  return <Payload,>({
    uuid,
    value,
    payload,
    action,
    disabled,
    ...restRenderOptionComponentProps
  }: Omit<T, keyof ListBoxOptionInternalProps> & ListBoxOptionProps<Payload>) => {
    const { isHighlighted, isSelected, onClick, itemDomProps } = useListBoxOption({
      uuid, // not mandatory here,
      disabled,
      payload,
      value,
      action,
    });

    return (
      <ListItemComponent
        {...itemDomProps}
        /*
            assertion is needed because of a current bug in TS
            https://github.com/Microsoft/TypeScript/issues/28938#issuecomment-450636046
        */
        {...(restRenderOptionComponentProps as T)}
        isHighlighted={isHighlighted}
        isSelected={isSelected}
        onClick={onClick}
        disabled={disabled}
      />
    );
  };
}
