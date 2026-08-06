import React from 'react';
import styled from 'styled-components';
import { MOCK_GUIDES } from 'stonly-editor/api/aiSource/mockDb';

/** Stub of the editor's guide finder (real one is Redux/API-coupled). Same callback contract. */
const Wrap = styled.div`
  display: flex; flex-direction: column;
  max-height: ${({ maxHeight }) => maxHeight || '256px'};
  overflow-y: auto;
`;
const Header = styled.div`
  ${({ theme }) => theme.typography.uiElementSmallStrong};
  color: ${({ theme }) => theme.color.textSubtle};
  padding: 8px 12px 4px;
`;
const GuideRow = styled.button`
  font-family: inherit; text-align: left; background: none; border: none; cursor: pointer;
  ${({ theme }) => theme.typography.uiElement};
  color: ${({ theme }) => theme.color.textDark};
  padding: 10px 12px; border-radius: 4px;
  &:hover { background: ${({ theme }) => theme.color.backgroundActionSubtleHover}; }
`;
const Languages = styled.span`
  ${({ theme }) => theme.typography.uiElementSmall};
  color: ${({ theme }) => theme.color.textSubtle};
  margin-left: 8px;
`;

const ExplanationFinder = ({ actionOnSelect, headerText, maxHeight, shouldShowBpaBadge }) => (
  <Wrap maxHeight={maxHeight}>
    {headerText && <Header>{headerText}</Header>}
    {MOCK_GUIDES.filter(guide => (shouldShowBpaBadge ? guide.bpaEnabled : true)).map(guide => (
      <GuideRow
        key={guide.id}
        type="button"
        onClick={() =>
          actionOnSelect(guide.title, guide.id, { languageList: guide.languageList, bpaEnabled: guide.bpaEnabled })
        }
      >
        {guide.title}
        <Languages>{guide.languageList.toUpperCase()}</Languages>
      </GuideRow>
    ))}
  </Wrap>
);

export default ExplanationFinder;
