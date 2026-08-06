import React from 'react';
import styled from 'styled-components';
import CloseSVG from '@ui/atoms/icons/Cross-16.svg';

export interface DialogCloseButtonProps {
  onClick: () => void;
  className?: string;
  tabIndex?: number;
  autoFocus?: boolean;
}

const CloseIcon = styled(CloseSVG)`
  display: block;
  margin: auto;
  path {
    fill: ${props => props.theme.color.iconDefaultInverse};
  }
`;

const CloseButton = styled.button<DialogCloseButtonProps>`
  padding: 0;
  margin: 0;
  position: absolute;
  top: 38px;
  right: 32px;
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

export const DialogCloseButton = (props: DialogCloseButtonProps) => {
  return (
    <CloseButton {...props}>
      <CloseIcon />
    </CloseButton>
  );
};
