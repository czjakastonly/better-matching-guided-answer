import styled, { css } from 'styled-components';
import { type WarningDialogSize } from '@ui/components/dialogs/WarningDialog';

// :-)
export const DialogWrap = styled.div<{ size?: WarningDialogSize }>`
  position: relative;

  ${({ size }) => {
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
