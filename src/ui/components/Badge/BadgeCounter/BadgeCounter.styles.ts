import styled, { css } from 'styled-components';

import { BadgeBase } from '../_shared/styles';

export const CounterBadgeElement = styled(BadgeBase)<{ $variant: 'default' | 'important' }>`
  padding: 0 4px;
  border-radius: 16px;
  min-width: 16px;
  ${({ theme }) => theme.typography.paragraphSmall};
  ${({ theme, $variant }) => {
    if ($variant === 'important') {
      return css`
        background-color: ${theme.color.backgroundPrimary};
        color: ${theme.color.textDefaultInverse};
      `;
    }
    return css`
      background-color: ${theme.color.backgroundGraySubtle};
      color: ${theme.color.textDefault};
    `;
  }};
`;
