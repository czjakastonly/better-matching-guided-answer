import styled, { css } from 'styled-components';

export const DialogContentWrap = styled.div<{ isLoading?: boolean }>`
  ${props => props.theme.typography.paragraph1};
  max-height: calc(100vh - 300px);
  max-width: 100%;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  ${({ isLoading }) =>
    isLoading &&
    css`
      max-height: 112px;
    `}
`;
