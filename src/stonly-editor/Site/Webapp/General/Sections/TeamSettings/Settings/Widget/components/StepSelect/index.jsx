import React from 'react';
import styled from 'styled-components';
import { MOCK_GUIDES } from 'stonly-editor/api/aiSource/mockDb';

/** Stub of the editor's guide step picker (real one is Redux/API-coupled). Same callback contract. */
const Wrap = styled.div`display: flex; flex-direction: column; max-height: 220px; overflow-y: auto;`;
const StepRow = styled.button`
  font-family: inherit; text-align: left; background: none; border: none; cursor: pointer;
  ${({ theme }) => theme.typography.uiElement};
  color: ${({ theme }) => theme.color.textDark};
  padding: 10px 12px; border-radius: 4px;
  &:hover { background: ${({ theme }) => theme.color.backgroundActionSubtleHover}; }
`;

const StepSelect = ({ guideId, onStepSelect }) => {
  const guide = MOCK_GUIDES.find(g => g.id === guideId);
  return (
    <Wrap>
      {(guide ? guide.steps : []).map(step => (
        <StepRow key={step.id} type="button" onClick={() => onStepSelect(step.id, step.name)}>
          {step.name}
        </StepRow>
      ))}
    </Wrap>
  );
};

export default StepSelect;
