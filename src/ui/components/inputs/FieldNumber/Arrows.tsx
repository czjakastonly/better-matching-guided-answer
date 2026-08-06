import React from 'react';
import styled, { css } from 'styled-components';
import TriangleSVG from '@ui/atoms/icons/TriangleArrowDown-12.svg';

const Container = styled.div`
  height: 36px;
  position: relative;
  padding: 0 6px;
`;

const Arrow = styled(TriangleSVG)<{ $disabled?: boolean; $active?: boolean }>`
  position: absolute;
  cursor: pointer;
  outline: none;
  left: 0;
  path {
    transition: fill 0.2s;
    fill: ${({ theme }) => theme.color.iconDefault};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background-color: ${theme.color.backgroundDefaultActive};
    `}

  &:hover {
    background-color: ${({ theme }) => theme.color.backgroundDefaultHover};
  }

  &:first-child {
    top: 4px;
    transform: rotate(180deg);
  }

  &:last-child {
    bottom: 4px;
  }
`;

export const Arrows = ({
  onDownClick,
  onUpClick,
  isDownActive,
  isUpActive,
  disabled,
}: {
  onDownClick: () => void;
  onUpClick: () => void;
  isDownActive?: boolean;
  isUpActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <Container>
      <Arrow
        $disabled={disabled}
        $active={isUpActive}
        onClick={onUpClick}
        onMouseDown={e => e.preventDefault() /* prevent text selection on dbclick & input's blurring */}
        aria-hidden
      />
      <Arrow
        $disabled={disabled}
        $active={isDownActive}
        onClick={onDownClick}
        onMouseDown={e => e.preventDefault() /* prevent text selection on dbclick & input's blurring */}
        aria-hidden
      />
    </Container>
  );
};
