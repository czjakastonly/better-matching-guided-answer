import React, { useCallback, useState } from 'react';

import { ColumnFlex, RowFlex } from '@ui/components/Flex';

import styled from 'styled-components';
import { ListItemStandard } from '@ui/components/List';
import {
  useInteractionActionContainer,
  useInteractionActionItem,
  InteractionActionProvider,
} from '@ui/utils/interactions/InteractionAction';
import {
  useInteractionHighlightContainer,
  useInteractionHighlightItem,
  InteractionHighlightProvider,
} from '@ui/utils/interactions/InteractionHighlight';
import { useInteractionSelectItem, InteractionSelectProvider } from '@ui/utils/interactions/InteractionSelect';

const StyledContainer = styled.div`
  border: 1px solid lightgrey;
  padding: 5px;
  width: 300px;
  &:focus {
    border-color: darkblue;
  }
`;

/**
 * Custom, simplified container built from scratch. Check ListBox for more (refs, autofocus)
 */
const Container = ({ ...props }) => {
  /* collect interaction-highlight related handlers */
  const { containerRef, handleArrowDownPressed, handleArrowUpPressed, handleBlur } = useInteractionHighlightContainer();

  /* collect interaction-action related handlers */
  const { handleEnterPressed, handleSpacePressed } = useInteractionActionContainer();

  /* for interaction-select there is no need to add logic to the container */
  /* */

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'ArrowDown') {
        handleArrowDownPressed(e);
      } else if (e.key === 'ArrowUp') {
        handleArrowUpPressed(e);
      } else if (e.key === 'Enter') {
        handleEnterPressed(e);
      } else if (e.key === ' ') {
        handleSpacePressed(e);
      }
    },
    [handleArrowDownPressed, handleArrowUpPressed, handleEnterPressed, handleSpacePressed]
  );

  return (
    <StyledContainer
      {...props}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      tabIndex={-1} // THIS IS MANDATORY FOR THE CONTAINER. IT MUST LISTEN KEYBOARD EVENTS
      ref={containerRef} // THIS IS MANDATORY FOR THE CONTAINER
    />
  );
};

const Item = ({
  payload, // for interaction-action - will be passed to action function
  action, // interaction-action - item function. If not provided, then container's defaultAction will be called
  disabled, // for interaction-highlight (won't be keyboard accessible) & interaction-action(won't be clickable)
  ...rest
}) => {
  /** for debugging or future aria-activedescendant handling. Can be taken/computed from props  */
  const [uuid] = useState(`${Math.random()}`);

  /**
   * for interaction-select. Will be compared to Provider's "selectedValue" to mark element as selected.
   * could be also taken from props like in <Select> component
   */
  const { itemDomProps: selectItemDomProps, isSelected } = useInteractionSelectItem({ uuid, value: payload });

  const { itemDomProps: highlightItemDomProps, isHighlighted } = useInteractionHighlightItem({
    uuid,
    disabled,
    prioritized: isSelected,
  });

  const { onClick } = useInteractionActionItem({ uuid, disabled, action, payload, isCurrent: isHighlighted });

  return (
    <ListItemStandard // you can use your own component.
      {...rest}
      {...highlightItemDomProps}
      {...selectItemDomProps}
      disabled={!!disabled}
      isSelected={isSelected}
      isHighlighted={isHighlighted}
      onClick={onClick}
    />
  );
};

export const Interactions = () => {
  const [valueList, setValueList] = useState(['foo']);
  const [isDisabled, setDisabled] = useState(true);
  const [isVisible, setVisible] = useState(true);

  const toggleSelectValue = value => {
    const newValueList = valueList.includes(value) ? valueList.filter(el => el !== value) : [...valueList, value];
    setValueList(newValueList);
  };

  return (
    <RowFlex gap={3} marginBottom={10}>
      <ColumnFlex>
        <p>
          All interactions (select, action, highlight) to play with manual testing. Click on elements or play with
          keyboard
        </p>
        <p>{`Selected value: ${valueList.join(', ') || ''}`}</p>

        <InteractionHighlightProvider>
          <InteractionActionProvider defaultAction={toggleSelectValue}>
            <InteractionSelectProvider selectedValue={valueList}>
              <Container>
                <Item payload="foo" label="payload item: 'foo'" />
                <Item payload="bar" label="payload item: 'bar'" />
                <Item payload="baz" label="payload item: 'baz'" />
                <Item action={() => setValueList([])} label="action item: Clear selection" />

                <p>...this is just a raw paragraph element </p>
                <Item payload={Math.random()} label="payload item: dynamic value" />
                <Item action={() => setVisible(!isVisible)} label="action item: show/hide next item" />
                {isVisible && (
                  <Item
                    payload="Friend"
                    action={name => alert(`hello ${name}`)}
                    label='mixed item: action with payload "Friend"'
                  />
                )}
                <Item action={() => setDisabled(!isDisabled)} label="action item: disable/enable last" />
                <Item payload="last" disabled={isDisabled} label='payload item: "last"' />
              </Container>
            </InteractionSelectProvider>
          </InteractionActionProvider>
        </InteractionHighlightProvider>
      </ColumnFlex>
    </RowFlex>
  );
};

export default {
  title: 'Design System/Utils',
  args: {},
  components: Interactions,
  parameters: {
    actions: { disabled: true },
  },
};
