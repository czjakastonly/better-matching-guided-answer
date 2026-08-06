import styled from 'styled-components';
import type { Status } from '@ui/models';
import { resolveMessageColorForInputStatus } from '../_shared/helpers';

/**
 * An input message text styled properly for provided status (red for error, etc.)
 */
export const InputStatusMessage = styled('span').withConfig({
  shouldForwardProp: prop => !['status'].includes(prop),
})<{ status?: Status | false }>`
  ${({ theme }) => theme.typography.uiElementSmallStrong};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  color: ${({ theme, status }) => resolveMessageColorForInputStatus(theme, status) || theme.color.textDark};
`;
