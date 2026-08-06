import styled, { css } from 'styled-components';
import ExternalLinkSmallSVG from 'icons/externalLinkTiny.svg';
import ExplanationSVG from '@ui/atoms/icons/Guide-color-16.svg';
import KnowledgeBaseSVG from '@editorCommon/resources/icons/knowledgeBase.svg';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import AiAgentSVG from '@ui/atoms/icons/AiAgent-16.svg';

export const ListWrapper = styled(ColumnFlex)<{ framed?: boolean }>`
  list-style: none;
  overflow: auto;

  ${({ framed }) =>
    framed &&
    css`
      max-height: 300px;
      padding: 16px;
      border-radius: 4px;
      border: 1px solid ${props => props.theme.color.borderDefault};
      border-top: none;
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      margin-top: -21px;
    `}
`;

export const ItemCanvas = styled(RowFlex).attrs({
  alignItems: 'center',
  gap: 1,
})`
  ${props => props.theme.typography.paragraph1Strong}
  color: ${props => props.theme.color.textDefault};
`;
export const ExternalLinkIcon = styled(ExternalLinkSmallSVG)`
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
  & path {
    fill: ${props => props.theme.color.iconDefaultWithText};
  }
`;
export const ListItem = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 16px 8px 12px;
  gap: 12px;
  border-radius: 4px;

  &:hover,
  &:focus-visible {
    background: ${props => props.theme.color.backgroundDefaultHover};
    ${ItemCanvas} {
      color: ${props => props.theme.color.textDark};
    }
    ${ExternalLinkIcon} {
      opacity: 1;
    }
  }
`;

export const GuideCanvas = styled(RowFlex).attrs({
  alignItems: 'center',
  gap: 0.5,
})`
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: ${props => props.theme.color.textPlaceholder};
`;

export const tinyIconStyles = css`
  width: 12px;
  height: 12px;
`;

export const TinyExplanationIcon = styled(ExplanationSVG)`
  ${tinyIconStyles}
`;

export const KnowledgeBaseIcon = styled(KnowledgeBaseSVG)`
  path {
    fill: ${props => props.theme.color.iconGuide};
  }
`;

export const TinyKnowledgeBaseIcon = styled(KnowledgeBaseSVG)`
  ${tinyIconStyles};
  flex-shrink: 0;
  path {
    fill: ${props => props.theme.color.iconGuide};
  }
`;

export const AiAgentIcon = styled(AiAgentSVG)`
  flex-shrink: 0;

  path {
    fill: ${props => props.theme.color.iconGuide};
  }
`;

export const EmptyMessage = styled(RowFlex)`
  ${props => props.theme.typography.uiElement}
  color: ${props => props.theme.color.textSubtle};
`;
