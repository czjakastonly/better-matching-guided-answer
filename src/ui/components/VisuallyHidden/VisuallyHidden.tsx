import styled from 'styled-components';

export const VisuallyHidden = styled.span`
  border: 0 !important;
  clip-path: inset(0) !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  height: 1px !important;
  margin: -1px !important;
  outline-offset: 0 !important;
  outline: 0 !important;
  overflow: hidden !important;
  padding: 0 !important;
  pointer-events: none !important;
  position: absolute !important;
  width: 1px !important;
`;
