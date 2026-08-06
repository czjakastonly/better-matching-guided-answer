import type React from 'react';
import { type DefaultTheme } from 'styled-components';

export interface IconSvgProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** function with theme given or color provided directly */
  color?: ((theme: DefaultTheme) => string) | string;
  as?: React.ElementType;
}
