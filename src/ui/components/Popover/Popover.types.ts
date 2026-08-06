import type { HTMLMotionProps } from 'framer-motion';
import type React from 'react';

export interface PopoverProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  minWidthPx?: number;
  maxWidthPx?: number;
  maxHeightPx?: number;
  isFocusLocked?: boolean;
  zIndex?: number;
}
