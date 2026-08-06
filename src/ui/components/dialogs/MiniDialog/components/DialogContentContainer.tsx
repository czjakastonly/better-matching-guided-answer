import styled from 'styled-components';

export const DialogContentContainer = styled.div<{ isNoPadding?: boolean }>`
  padding: 0;

  max-height: calc(100vh - 300px);
`;
