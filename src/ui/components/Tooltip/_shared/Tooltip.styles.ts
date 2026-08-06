import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const TriggerWrap = styled.span``;

const BalloonWrap = styled(motion.div).attrs({
  initial: { x: 0, y: 8, opacity: 0 },
  animate: { y: 0, x: 0, opacity: 1 },
  exit: { x: 0, y: 0, opacity: 0 },
  transition: { duration: 0.2 },
})`
  position: absolute;
  opacity: 0;
`;

const BalloonArrow = styled.div`
  z-index: -1;
  background: ${({ theme }) => theme.color.textDark};

  visibility: hidden;
  position: absolute;
  width: 6px;
  height: 6px;

  &::before {
    position: absolute;
    width: 6px;
    height: 6px;
    background: inherit;
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }
`;

const BalloonBody = styled(motion.div)<{ fitWidth?: boolean; width?: string | number; maxWidthPx?: number }>`
  background: ${({ theme }) => theme.color.backgroundGrayBoldest};
  text-align: left;
  padding: 8px 12px;
  color: ${({ theme }) => theme.color.textDefaultInverse};
  border-radius: 6px;
  font-size: 11px;
  line-height: 16px;
  font-weight: 700;
  max-width: ${({ maxWidthPx }) => maxWidthPx || 240}px;
  width: max-content;
  word-break: break-word;

  ${({ fitWidth }) =>
    fitWidth &&
    css`
      max-width: 100%;
      width: auto;
    `}
`;

const TriggerIconWrapper = styled.span`
  cursor: default;
  padding: 0;
  margin: 0 0 0 4px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  display: inline-block;
  vertical-align: bottom;
  border-radius: 8px;
  color: ${({ theme }) => theme.color.textPlaceholder};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.borderFocus};
    outline-offset: 2px;
  }

  & svg {
    width: 100%;
    height: 100%;
  }

  & svg path {
    fill: ${({ theme }) => theme.color.iconSubtle};
    transition: fill 0.2s;
  }
  &:hover svg path,
  &:focus svg path {
    fill: ${props => props.theme.color.iconDefault};
    transition: fill 0.2s;
  }
`;

export default {
  TriggerWrap,
  BalloonWrap,
  BalloonArrow,
  BalloonBody,
  TriggerIconWrapper,
};
