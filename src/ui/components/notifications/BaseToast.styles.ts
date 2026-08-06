import styled from 'styled-components';
import { BaseNotification } from './BaseNotification.styles';

const Content = styled(BaseNotification.Content)`
  color: ${({ theme }) => theme.color.textDefaultInverse};
`;

const Container = styled(BaseNotification.Container)<{ $statusColor: string | undefined }>`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.color.textDark};
  gap: 12px;
  padding: 16px;
  border-radius: 4px;
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: ${({ $statusColor }) => $statusColor};

  & a {
    text-decoration: underline;
    text-decoration-color: ${props => props.theme.color.textDefault};
  }
`;

const IconContainer = styled.div`
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  ${props => props.theme.typography.uiElementLabel};
  cursor: pointer;
  background: none;
  color: ${({ theme }) => theme.color.textDefaultInverse};
  border: 1px solid ${({ theme }) => theme.color.borderDefault};
  border-radius: 50px;
  padding: 6px 12px;
  transition: border-color 0.2, color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.textPlaceholder};
    border-color: ${({ theme }) => theme.color.borderDefaultHover};
  }
`;

const StyledCloseSVG = styled(BaseNotification.StyledCloseSVG)`
  path {
    fill: ${({ theme }) => theme.color.iconSubtle};
    transition: fill 0.2s;
  }
  &:hover {
    path {
      fill: ${({ theme }) => theme.color.iconDefault};
    }
  }
`;

export const BaseToast = {
  Container,
  IconContainer,
  Content,
  ActionButton,
  StyledCloseSVG,
};
