import styled from 'styled-components';

export const DialogContent = styled.div`
  max-height: calc(100vh - 300px);
  overflow: auto;
  ${props => props.theme.scrollbars.basic};
`;
