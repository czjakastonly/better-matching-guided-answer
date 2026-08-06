import React from 'react';
import styled from 'styled-components';
import CloseSVG from '@ui/atoms/icons/Cross-16.svg';

export interface ModalWindowCloseButtonProps {
  top: string;
  right: string;
  onClick: () => void;
  className?: string;
  tabIndex: number;
}

const CloseIcon = styled(CloseSVG)`
  display: block;
  margin: auto;
  path {
    fill: ${props => props.theme.color.iconDefaultInverse};
  }
`;

const CloseButton = styled.button<ModalWindowCloseButtonProps>`
  padding: 0;
  margin: 0;
  position: absolute;
  z-index: 1;
  top: ${props => props.top};
  right: ${props => props.right};
  display: flex;
  background-color: ${props => props.theme.color.backgroundGrayDefault};
  border-radius: 50%;
  border-color: transparent;
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  outline: 0;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.borderFocus};
    outline-offset: 2px;
  }

  &:hover {
    background-color: ${props => props.theme.color.backgroundGrayBold};
  }
`;

/** @deprecated. let the content have it's own button */
export const ModalWindowCloseButton = (props: ModalWindowCloseButtonProps) => {
  return (
    <CloseButton {...props}>
      <CloseIcon />
    </CloseButton>
  );
};
