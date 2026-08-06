import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

import StonlyLogoAnimated from './loaders/StonlyLogo';
import CircleAnimated from './loaders/Circle';
import DotsAnimated from './loaders/Dots';

const Canvas = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bfc1c6;

  ${({ orientation }) =>
    orientation === 'horizontal' &&
    css`
      flex-direction: row;

      svg {
        height: 32px;
        width: 32px;
      }
    `}
`;

const Content = styled.div`
  font-size: 20px;
  color: ${props => props.theme.lightGrey};

  ${({ orientation }) =>
    orientation === 'horizontal' &&
    css`
      font-size: 14px;
      line-height: 24px;
      color: #8b8e95;
      margin-left: 4px;
    `}
`;

export const FullscreenLoaderWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

export const FlexGrowLoaderWrap = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const loadersMap = {
  logo: StonlyLogoAnimated,
  circle: CircleAnimated,
  dots: DotsAnimated,
};

const Loader = ({ text, className, type = 'logo', monochrome, orientation = 'vertical' }) => {
  const LoaderToUse = loadersMap[type];
  return (
    <Canvas className={className} orientation={orientation}>
      <LoaderToUse monochrome={monochrome} />
      <Content orientation={orientation}>{text}</Content>
    </Canvas>
  );
};

Loader.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  monochrome: PropTypes.bool,
  orientation: PropTypes.string,
};

export default Loader;
