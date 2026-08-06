import React from 'react';
import styled from 'styled-components';
import { ListItemStyles } from './_shared/styles';

const Text = styled.div`
  ${props => props.theme.typography.uiElementLabel};
  color: ${props => props.theme.color.textPlaceholder};
`;

const RightIconContainer = styled.div`
  margin-left: 6px;
`;

export interface ListSectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  iconRight?: React.ReactNode;
}

export const ListSectionHeading = ({ iconRight, children, ...restDivAttributes }: ListSectionHeadingProps) => (
  <ListItemStyles.Container {...restDivAttributes}>
    <Text>{children}</Text>
    {iconRight && <RightIconContainer>{iconRight}</RightIconContainer>}
  </ListItemStyles.Container>
);
