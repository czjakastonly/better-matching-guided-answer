import React from 'react';
import styled, { keyframes } from 'styled-components';

const circleSpinner = keyframes`
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: calc(0.66 * 100%);
  } 50% {
    transform: rotate(720deg);
    stroke-dashoffset: calc(3.14 * 100%);
  } 100% {
    transform: rotate(1080deg);
    stroke-dashoffset: calc(0.66 * 100%);
  }
`;
const loaderAppearence = keyframes`
  0% {
    opacity: 0
  } 99% {
    opacity: 0
  } 100% {
    opacity: 1
  }
`;

const Wrapper = styled.svg`
  width: 40px;
  height: 40px;
  animation: ${loaderAppearence} 1000ms ease-in;

  circle {
    fill: transparent;
    stroke: ${({ theme }) => theme.color.backgroundPrimary};
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-dasharray: calc(3.14 * 100%);
    transform-origin: 50% 50% 0;
    animation: ${circleSpinner} 2500ms linear infinite forwards;
    animation-delay: 1000ms;
  }
`;

const Loader = () => {
  return (
    <Wrapper>
      <circle cx="50%" cy="50%" r="48%" />
    </Wrapper>
  );
};

export default Loader;
