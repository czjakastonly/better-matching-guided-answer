import styled, { css } from 'styled-components';

import { BadgeBase } from '../_shared/styles';

export const AvatarBadgeElement = styled(BadgeBase)<{ $size: 'small' | 'large' }>`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.backgroundMagentaBold};
  color: ${({ theme }) => theme.color.textDefaultInverse};
  ${({ theme, $size }) => {
    if ($size === 'small') {
      return css`
        width: 24px;
        height: 24px;
        ${theme.typography.uiElementLabelSmall};
      `;
    }
    return css`
      width: 40px;
      height: 40px;
      ${theme.typography.uiElementStrong};
    `;
  }};
`;
