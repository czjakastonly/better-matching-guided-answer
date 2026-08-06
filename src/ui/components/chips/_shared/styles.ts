import styled, { css } from 'styled-components';
import type { ChipSize } from './types';

function resolveBackground($background?: string, $borderColor?: string, fallback?: string): string {
  if ($background) return $background;
  if ($borderColor) return `color-mix(in srgb, ${$borderColor} 12%, white)`;
  return fallback || 'transparent';
}

export const ChipElement = styled.span<{
  $background?: string;
  $borderColor?: string;
  $size?: ChipSize;
}>`
  ${({ theme, $size }) =>
    $size === 'small' ? theme.typography.uiElementSmallStrong : theme.typography.uiElementStrong};
  display: inline-flex;
  align-items: center;
  padding: ${({ $size }) => ($size === 'small' ? '2px 8px' : '4px 8px')};
  border-radius: 4px;
  color: ${({ theme }) => theme.color.textSubtle};
  background: ${({ $background, $borderColor, theme }) =>
    resolveBackground($background, $borderColor, theme.color.backgroundGraySubtlest)};
  border: 1px solid
    ${({ $borderColor }) => ($borderColor ? `oklch(from ${$borderColor} min(l, 0.9) c h)` : 'transparent')};
  word-break: break-word;
`;

export const ChipTruncatableElement = styled(ChipElement)<{ $maxWidth?: string | number; $size?: ChipSize }>`
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ $maxWidth }) =>
    $maxWidth != null &&
    css`
      max-width: ${typeof $maxWidth === 'number' ? `${$maxWidth}px` : $maxWidth};
    `}
`;
