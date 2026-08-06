import { STATIC_CLASS_NAME } from '@ui/constants';
import styled from 'styled-components';

export const DialogFooterWrap = styled.div`
  display: flex;
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.color.borderSubtle};
  align-items: center;
  .${STATIC_CLASS_NAME.buttonMinimal} {
    margin-left: -16px;
  }
`;
