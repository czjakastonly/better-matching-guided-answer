import styled from 'styled-components';
import { ColumnFlex } from '@ui/components/Flex';

export const Column = styled.div`
  position: relative;
  ${props => props.theme.typography.paragraph1}

  &.icon-show {
    opacity: 0;
    transition: opacity 0.2s;
  }
`;
export const TextColumn = styled(Column)`
  word-break: break-word;
  padding: 0 8px;
`;

export const IconColumn = styled(Column)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MenuColumn = styled(Column)`
  padding-right: 16px;
`;

export const EmptyState = styled(ColumnFlex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  marginY: 12,
  marginX: 'auto',
})`
  max-width: 280px;
  text-align: center;
`;

export const EmptyStateText = styled.div`
  font-size: 20px;
  line-height: 28px; /* 140% */
  letter-spacing: -0.4px;
  margin-top: 12px;
  margin-bottom: 24px;
  color: ${props => props.theme.color.textSubtle};
`;

export const tableHeaderStyle = {
  paddingTop: 24,
  paddingBottom: 24,
  position: 'sticky',
  top: 81,
  background: '#ffffff',
};

export const textHeaderStyle = {
  paddingLeft: 16,
  paddingRight: 16,
};
