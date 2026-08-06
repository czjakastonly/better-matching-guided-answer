import styled, { css } from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  z-index: 0;
`;

const Bar = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundGrayBold};
  height: 6px;
  max-width: 100%;
  position: absolute;
  left: 0;
  top: calc(50% - 2px);
  border-radius: 3px 3px 3px 3px;
  z-index: -1;
`;

const BarBg = styled(Bar)`
  background-color: ${({ theme }) => theme.color.backgroundGraySubtle};
  border-radius: 3px;
  right: 0;
`;

const SliderBarStyle = css`
  width: 100%;
  height: 6px;
  cursor: pointer;
  background: transparent;
  border-radius: 3px;
`;

const SliderThumbStyle = css`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadows.basic};
  background-color: ${({ theme }) => theme.color.backgroundDefault};
  cursor: pointer;
`;

const Slider = styled.input`
  appearance: none;
  width: 100%;
  margin: 0;
  background: transparent;

  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    ${SliderBarStyle}
  }
  &::-webkit-slider-thumb {
    ${SliderThumbStyle}
    appearance: none;
    margin-top: -6px;
  }
  &::-moz-range-track {
    ${SliderBarStyle}
  }
  &::-moz-range-thumb {
    ${SliderThumbStyle}
    border: none;
  }
  &::-moz-focus-outer {
    border: 0;
  }
  &::-ms-track {
    ${SliderBarStyle}
    color: transparent;
    border-color: transparent;
  }
  &::-ms-fill-lower {
    background: transparent;
    border-radius: 3px;
  }
  &::-ms-fill-upper {
    background: transparent;
    border-radius: 3px;
  }
  &::-ms-thumb {
    ${SliderThumbStyle}
  }
`;

export default { Container, Slider, Bar, BarBg };
