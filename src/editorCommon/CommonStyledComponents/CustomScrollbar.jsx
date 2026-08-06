import { css } from 'styled-components';

export const defaultScrollStyles = css`
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    opacity: 0;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.lightGrey};
    border-radius: 6px;
    border: 2px solid white;
    background-size: cover;
    background-position: center;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${props => props.theme.grey};
  }
`;

export const defaultVerticalScrollStyles = css`
  ${defaultScrollStyles};

  &::-webkit-scrollbar {
    height: 10px;
  }
`;

export const getCustomBgScrollStyles = (background, barColor, barColorHover) => css`
  ${defaultScrollStyles};

  &::-webkit-scrollbar-thumb {
    background-color: ${props => barColor || props.theme.lightGrey};
    border: 2px solid ${background || 'white'};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${props => barColorHover || props.theme.grey};
  }

  &::-webkit-scrollbar-corner {
    background-color: ${background || 'white'};
  }
`;

export const getStepsGlobalScrollbarStyles = ({ marginTop = 0, marginBottom = 0 } = {}) => css`
  html {
    ${defaultScrollStyles};
    overflow-x: hidden;
    margin-right: calc(-1 * (100vw - 100%));

    @supports (overflow-y: overlay) {
      overflow-y: overlay;
      overflow-x: initial;
      margin-right: initial;
    }

    &::-webkit-scrollbar-track {
      opacity: 0;
      margin-top: ${marginTop};
      margin-bottom: ${marginBottom};
    }
  }
`;
