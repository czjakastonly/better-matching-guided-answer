import styled from 'styled-components';

export const TextWithLink = styled.span`
  a {
    color: ${({ theme }) => theme.color.textLink};
  }
`;
