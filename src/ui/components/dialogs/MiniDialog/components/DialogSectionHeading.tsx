import styled from 'styled-components';

export const DialogSectionHeading = styled.div`
  ${props => props.theme.typography.uiElementLabel};
  color: ${props => props.theme.color.textPlaceholder};
`;
