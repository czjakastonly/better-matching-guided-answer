import styled, { keyframes, css } from 'styled-components';

const fadeKeyframes = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const Dot = styled.span`
  display: block;
  animation-duration: 0.6s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  transform-origin: center;
  animation-name: ${fadeKeyframes};
  width: 8px;
  height: 8px;
  background: ${props => props.theme.color.backgroundDefault};
  border-radius: 50%;
`;

export const DotsWrap = styled.span<{ isDark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 8px;
  width: 40px;

  ${Dot}:nth-child(1) {
    animation-delay: -0.3s;
  }
  ${Dot}:nth-child(3) {
    animation-delay: 0.3s;
  }

  ${Dot} {
    ${({ theme, isDark }) =>
      isDark &&
      css`
        background: ${theme.color.backgroundGrayDefault};
      `}
  }
`;
