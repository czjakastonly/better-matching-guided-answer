import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import CircleSVG from 'resources/shapes/progressCircle.svg';

const rotateKeyframes = keyframes`
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
`;

const CircleSVGFiltered = ({ monochrome, ...props }) => <CircleSVG {...props} />;
export default styled(CircleSVGFiltered)`
  animation-duration: 1s;
  animation-iteration-count: infinite;
  transform-origin: center;
  animation-name: ${rotateKeyframes};

  circle {
    stroke-dasharray: 90;
    stroke-width: 2px;

    ${({ monochrome }) =>
      monochrome &&
      css`
        stroke: ${props => props.theme.grey};
      `}
  }
`;
