import React from 'react';
import type { ButtonSplitRectangleProps } from './ButtonSplitRectangle.types';
import { Container } from './ButtonSplitRectangle.styles';

/**
 * Accepts `ButtonOutline` (or any Outline-variant) children and forces:
 *  - 4px outer radius with flat inner edges
 *  - `borderSuccess` green border across all interactive states
 *  - 40px height
 *
 * Adjacent child borders are collapsed with `margin-left: -1px` so the shared
 * edge renders as a single 1px green divider.
 */
export const ButtonSplitRectangle = ({ children, ...rest }: ButtonSplitRectangleProps) => {
  return <Container {...rest}>{children}</Container>;
};
