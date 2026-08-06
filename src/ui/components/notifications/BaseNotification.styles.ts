import styled, { css } from 'styled-components';
import CrossSVG from '@ui/atoms/icons/Cross-16.svg';

const IconContainer = styled.div`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const CloseIconContainer = styled(IconContainer)`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-left: auto;
`;

const linkStyle = css`
  color: ${({ theme }) => theme.color.textLink};
  text-decoration: none;
  transition: color 0.2s, text-decoration 0.2s;

  &:hover {
    text-decoration: underline;
  }

  &:active {
    color: ${({ theme }) => theme.color.textLinkPressed};
    text-decoration: underline;
  }
`;

const Content = styled.div`
  ${props => props.theme.typography.paragraph1};
  color: ${props => props.theme.color.textDark};

  a {
    ${linkStyle}
  }
`;

const ContentSmall = styled.div`
  ${props => props.theme.typography.paragraph2};
  color: ${props => props.theme.color.textDark};

  a {
    ${linkStyle}
  }
`;

const StatusIconContainer = styled.div<{ $statusColor: string | undefined }>`
  flex-shrink: 0;
  path {
    fill: ${({ $statusColor }) => $statusColor};
  }
`;

const Container = styled.div<{ $statusColor: string | undefined }>`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 4px;
  background: ${props => props.$statusColor};
  ${StatusIconContainer} {
    margin-top: 4px;
  }

  ${CloseIconContainer} {
    margin-top: 4px;
  }
`;

const ContainerSmall = styled(Container)`
  padding: 12px;
  padding-left: 16px;

  ${StatusIconContainer} {
    margin-top: 2px;
  }

  ${CloseIconContainer} {
    margin-top: 2px;
  }
`;

const StyledCloseSVG = styled(CrossSVG)`
  cursor: pointer;
  path {
    fill: ${({ theme }) => theme.color.iconDefault};
    transition: fill 0.2s;
  }
  &:hover {
    path {
      fill: ${({ theme }) => theme.color.iconSubtle};
    }
  }
`;

export const BaseNotification = {
  Container,
  ContainerSmall,
  IconContainer,
  CloseIconContainer,
  Content,
  ContentSmall,
  StyledCloseSVG,
  StatusIconContainer,
};
