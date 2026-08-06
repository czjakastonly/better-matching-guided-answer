import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeKeyframes = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const Dot = styled.div`
  display: block;
  animation-duration: 0.6s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  transform-origin: center;
  animation-name: ${fadeKeyframes};
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
`;

const DotsWrap = styled.div`
  display: flex;
  align-items: center;
  height: 6px;
  width: 28px;
  justify-content: space-between;

  ${Dot}:nth-child(1) {
    animation-delay: -0.3s;
  }
  ${Dot}:nth-child(3) {
    animation-delay: 0.3s;
  }

  ${Dot} {
    ${({ theme, monochrome }) =>
      monochrome &&
      css`
        background: ${theme.charcoal};
      `}
  }
`;

export default ({ monochrome }) => (
  <DotsWrap className="dotsWrap" monochrome={monochrome}>
    <Dot className="dot" />
    <Dot className="dot" />
    <Dot className="dot" />
  </DotsWrap>
);
