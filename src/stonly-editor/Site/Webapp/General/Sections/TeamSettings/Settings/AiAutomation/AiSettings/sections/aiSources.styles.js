import styled from 'styled-components';
import TableHeader from '@editorCommon/CustomElements/Table/TableHeader';
import Divider from '@editorCommon/CustomElements/Divider';
import { Title, Card } from '@editorCommon/CommonStyledComponents/SettingsStyles';
import { ColumnFlex } from '@ui/components/Flex';

export const FiltersSection = styled(ColumnFlex).attrs({
  flexShrink: 0,
  justifyContent: 'flex-end',
  gap: 3,
  marginLeft: 3,
})`
  @media screen and (min-width: 1040px) {
    flex-direction: row;
  }
  & > * {
    min-width: 160px;
    max-width: 200px;
  }
`;

export const StyledCard = styled(Card)`
  position: relative;
  padding: 0 32px 24px 32px;
`;

export const StyledTableHeader = styled(TableHeader)`
  margin: 0 -32px;
`;

export const StyledDivider = styled(Divider)`
  top: 144px;
  width: calc(100% + 64px);
  margin-left: -32px;
`;

export const StyledTitle = styled(Title)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TitleName = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  margin-left: 16px;
`;

export const SettingsCard = styled(Card)`
  padding: 12px 32px;
`;
