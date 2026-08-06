import styled from 'styled-components';

const Label = styled.div`
  ${({ theme }) => theme.typography.uiElementSmallStrong};
  color: ${({ theme }) => theme.color.textSubtle};
  margin-bottom: 8px;
`;

const Container = styled.div`
  margin: 0;
  padding: 0;
  &:has([aria-expanded='true']), // for dropdown buttons
  &:focus-within {
    ${Label} {
      color: ${({ theme }) => theme.color.textDefault};
    }
  }
`;

const FieldsWrap = styled.div`
  margin: 0;
  padding: 0;
`;

const RequiredLabelSuffix = styled.span.attrs({ ariaHidden: true })`
  color: ${({ theme }) => theme.color.iconPink};
  margin-left: 2px;
`;

export default { Container, Label, FieldsWrap, RequiredLabelSuffix };
