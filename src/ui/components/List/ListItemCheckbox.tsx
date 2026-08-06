import React from 'react';
import styled, { css } from 'styled-components';
import TickSVG from '@ui/atoms/icons/Tick-12.svg';
import { ListItemStyles } from './_shared/styles';
import { RowFlex } from '../Flex';

export interface ListItemCheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  label?: React.ReactNode;
  isNavigationItem?: boolean;
}

const IconTick = styled(TickSVG)`
  & path {
    fill: ${({ theme }) => theme.color.iconDefaultInverse};
  }
`;

const Rect = styled.div<{ $checked?: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  transition: border-color 0.2s, background-color 0.2s;

  border-color: ${({ theme }) => theme.color.borderDefault};
  background-color: ${({ theme }) => theme.color.backgroundDefault};

  ${({ $checked }) =>
    $checked &&
    css`
      border-color: ${({ theme }) => theme.color.backgroundPrimary};
      background-color: ${({ theme }) => theme.color.backgroundPrimary};
    `}

  ${IconTick} {
    visibility: ${({ $checked }) => ($checked ? 'visible' : 'hidden')};
  }
`;

export const ListItemCheckbox = React.forwardRef<HTMLDivElement, ListItemCheckboxProps>(
  ({ disabled, isHighlighted, isSelected, label, isNavigationItem, ...restDivAttributes }, forwardedRef) => {
    return (
      <ListItemStyles.ContainerSelectable
        {...restDivAttributes}
        isDisabled={disabled}
        isHighlighted={isHighlighted}
        isSelected={isSelected}
        // Why not added automatically those props:
        // aria-selected={isSelected}
        // aria-disabled={disabled}
        // Because on multiselect we use aria-selected="false"; on single select it's just not set if false
        ref={forwardedRef}
      >
        <ListItemStyles.TextContainer>
          <RowFlex alignItems="center" gap={1}>
            <Rect $checked={isSelected} aria-hidden>
              <IconTick />
            </Rect>
            <ListItemStyles.Title>{label}</ListItemStyles.Title>
          </RowFlex>
        </ListItemStyles.TextContainer>
        {isNavigationItem && <ListItemStyles.ChevronRightIcon aria-hidden />}
      </ListItemStyles.ContainerSelectable>
    );
  }
);
