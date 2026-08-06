import styled, { css } from 'styled-components';
import type { ActionsDialogSize } from '../ActionsDialog.types';

export const DialogWrap = styled.div<{ size?: ActionsDialogSize; customSize?: number }>`
  position: relative;
  max-width: 100vw;
  overflow: auto;
  ${({ size, customSize }) => {
    if (size === 'custom' && customSize) {
      return css`
        width: ${customSize}px;
      `;
    }
    if (size === 'extraLarge') {
      return css`
        width: 960px;
      `;
    }
    if (size === 'large') {
      return css`
        width: 800px;
      `;
    }
    if (size === 'small') {
      return css`
        width: 480px;
      `;
    }
    return css`
      width: 640px;
    `;
  }};
`;
