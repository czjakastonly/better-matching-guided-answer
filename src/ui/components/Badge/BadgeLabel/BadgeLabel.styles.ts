import styled, { css } from 'styled-components';

import { BadgeBase } from '../_shared/styles';
import { type BadgeLabelVariant } from './BadgeLabel.types';

export const LabelBadgeElement = styled(BadgeBase)<{ $variant: BadgeLabelVariant }>`
  padding: 0 4px;
  border-radius: 4px;
  ${({ theme }) => theme.typography.paragraphSmall};
  ${({ theme, $variant }) => {
    if ($variant === 'success') {
      return css`
        background-color: ${theme.color.backgroundGreenSubtle};
        color: ${theme.color.textSuccess};
      `;
    }
    if ($variant === 'danger') {
      return css`
        background-color: ${theme.color.backgroundDangerSubtle};
        color: ${theme.color.textDanger};
      `;
    }
    if ($variant === 'info-dark') {
      return css`
        background-color: ${theme.color.backgroundBlueBold};
        color: ${theme.color.textDefaultInverse};
      `;
    }
    if ($variant === 'info-light') {
      return css`
        background-color: ${theme.color.backgroundBlueSubtle};
        color: ${theme.color.textInformationDark};
      `;
    }
    return css`
      background-color: ${theme.color.backgroundDefaultHover};
      color: ${theme.color.textSubtle};
    `;
  }};
`;
