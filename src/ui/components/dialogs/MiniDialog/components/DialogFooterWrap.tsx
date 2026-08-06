import { STATIC_CLASS_NAME } from '@ui/constants';
import styled from 'styled-components';

export const DialogFooterWrap = styled.div`
  display: flex;
  padding: 16px 16px;
  border-top: 1px solid ${props => props.theme.color.borderSubtle};
  align-items: center;
  .${STATIC_CLASS_NAME.buttonMinimal} {
    margin-left: -12px;
  }
`;
