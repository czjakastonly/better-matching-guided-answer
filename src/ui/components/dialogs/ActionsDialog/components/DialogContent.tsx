import styled from 'styled-components';

export const DialogContent = styled.div<{ isNoPadding?: boolean }>`
  padding: ${props => (props.isNoPadding ? '0' : '0px 32px 32px 32px')};
  max-height: calc(100vh - 300px);
  overflow: auto;
  ${props => props.theme.scrollbars.basic};
`;
