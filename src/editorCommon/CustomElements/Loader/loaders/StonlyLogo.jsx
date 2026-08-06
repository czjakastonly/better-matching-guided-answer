import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import StonlyLogoSVG from 'resources/logo/logoAnimated.svg';

const bottomLeftKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(1.75px, -27.5px, 0);
  }
  15% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  50% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  55% {
    opacity: 1;
  }
  65% {
    opacity: 0;
    transform: translate3d(1.75px, 14px, 0);
  }
  100% {
    opacity: 0;
    transform: translate3d(1.75px, 14px, 0);
  }
`;

const bottomRightKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0.25px, -29.5px, 0) rotate(20deg);
  }
  5% {
    opacity: 0;
    transform: translate3d(0.25px, -29.5px, 0) rotate(20deg);
  }
  20% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  55% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  60% {
    opacity: 1;
  }
  70% {
    opacity: 0;
    transform: translate3d(0px, 16px, 0) rotate(-15deg);
  }
  100% {
    opacity: 0;
    transform: translate3d(0px, 16px, 0) rotate(-15deg);
  }
`;

const centerLeftKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0.25px, -18px, 0) rotate(-15deg);
  }
  10% {
    opacity: 0;
    transform: translate3d(0.25px, -18px, 0) rotate(-15deg);
  }
  25% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  65% {
    opacity: 1;
  }
  75% {
    opacity: 0;
    transform: translate3d(0.25px, 24px, 0) rotate(15deg);
  }
  100% {
    opacity: 0;
    transform: translate3d(0px, 24px, 0) rotate(15deg);
  }
`;

const centerRightKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0px, -20px, 0);
  }
  15% {
    opacity: 0;
    transform: translate3d(0px, -20px, 0);
  }
  30% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  65% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  70% {
    opacity: 1;
  }
  80% {
    opacity: 0;
    transform: translate3d(0px, 22px, 0);
  }
  100% {
    opacity: 0;
    transform: translate3d(0px, 22px, 0);
  }
`;

const topKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0.25px, -8.5px, 0) rotate(-20deg);
  }
  20% {
    opacity: 0;
    transform: translate3d(0.25px, -8.5px, 0) rotate(-20deg);
  }
  35% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  67.5% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  72.5% {
    opacity: 1;
  }
  82.5% {
    opacity: 0;
    transform: translate3d(0.25px, 31.5px, 0) rotate(-20deg);
  }
  100% {
    opacity: 0;
    transform: translate3d(0.25px, 31.5px, 0) rotate(-20deg);
  }
`;

const FilteredStonlyLogoSVG = ({ monochrome, ...props }) => <StonlyLogoSVG {...props} />;

export default styled(FilteredStonlyLogoSVG)`
  path {
    animation-duration: 2s;
    animation-iteration-count: infinite;
    transform-origin: center;

    &:nth-child(1) {
      animation-name: ${topKeyframes};
    }
    &:nth-child(2) {
      animation-name: ${centerRightKeyframes};
    }
    &:nth-child(3) {
      animation-name: ${centerLeftKeyframes};
    }
    &:nth-child(4) {
      animation-name: ${bottomRightKeyframes};
    }
    &:nth-child(5) {
      animation-name: ${bottomLeftKeyframes};
    }

    ${({ monochrome }) =>
      monochrome &&
      css`
        fill: #8b8e95;
      `}
  }
`;
