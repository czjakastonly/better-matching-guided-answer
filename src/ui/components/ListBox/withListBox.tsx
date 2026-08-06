import type { ForwardedRef } from 'react';
import React from 'react';
import { InteractionSelectProvider } from '@ui/utils/interactions/InteractionSelect';
import { InteractionHighlightProvider } from '@ui/utils/interactions/InteractionHighlight';
import { InteractionActionProvider } from '@ui/utils/interactions/InteractionAction';
import { InteractionScrollProvider } from '@ui/utils/interactions/InteractionScroll';
import { withListBoxInteractionContainer } from './withListBoxInteractionContainer';
import type { ListBoxInteractionContainerInternalProps, ListBoxProps } from './ListBox.types';

export function withListBox<
  T extends ListBoxInteractionContainerInternalProps = ListBoxInteractionContainerInternalProps
>(Container: React.ComponentType<T>) {
  const ListBoxContainer = withListBoxInteractionContainer(Container);

  /**
   * ListBox component
   */
  return React.forwardRef(
    <Payload,>(
      { children, value, onAction, onPostAction, ...restListBoxProps }: ListBoxProps<Payload>,
      forwardedRef: ForwardedRef<HTMLDivElement>
    ) => {
      return (
        <InteractionSelectProvider selectedValue={value}>
          <InteractionHighlightProvider>
            <InteractionScrollProvider>
              <InteractionActionProvider<Payload> defaultAction={onAction} onPostAction={onPostAction}>
                <ListBoxContainer
                  /*
                assertion is needed because of a current bug in TS
                https://github.com/Microsoft/TypeScript/issues/28938#issuecomment-450636046
                */
                  {...(restListBoxProps as T)}
                  ref={forwardedRef}
                >
                  {children}
                </ListBoxContainer>
              </InteractionActionProvider>
            </InteractionScrollProvider>
          </InteractionHighlightProvider>
        </InteractionSelectProvider>
      );
    }
  );
}
