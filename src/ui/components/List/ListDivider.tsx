import styled from 'styled-components';

export const ListDivider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.color.borderSubtle};
  margin: 8px -8px 8px -8px;
  width: calc(100% + 8px + 8px);
`;
