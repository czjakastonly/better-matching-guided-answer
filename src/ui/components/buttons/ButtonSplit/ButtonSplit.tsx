import React from 'react';
import styled from 'styled-components';
import { ButtonStyles } from '../_shared/styles';
import type { ButtonSplitProps } from './ButtonSplit.types';

const Container = styled.div`
  margin: 0;
  padding: 0;
  display: inline-flex;
  gap: 1px;

  & > *:focus-visible {
    z-index: 1; // for the focus-visible outline to go up
  }

  // in the middle
  & > *:not(:first-child):not(:last-child) {
    border-radius: 0;
  }

  // edges icon-only
  & > *:first-child ${ButtonStyles.IconWrapOnly}, & > *:last-child ${ButtonStyles.IconWrapOnly} {
    margin-right: 2px;
  }

  // left edge
  & > *:first-child:not(:last-child) {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  // right edge
  & > *:last-child:not(:first-child) {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  // all but first
  & > ${ButtonStyles.OutlineButtonElement}:not(:first-child) {
    margin-left: -2px;
  }
`;

export const ButtonSplit = ({ children }: ButtonSplitProps) => {
  return <Container>{children}</Container>;
};
