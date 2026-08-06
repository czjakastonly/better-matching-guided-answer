import type React from 'react';
import type { OffsetOptions } from '@floating-ui/react-dom';
import type { HTMLMotionProps } from 'framer-motion';

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export interface TooltipBalloonProps
  extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'transition'> {
  fitWidth?: boolean;
  arrowRef: React.RefObject<HTMLDivElement>;
  arrowStyle: React.CSSProperties;
  maxWidthPx?: number;
}

export interface FloatingTooltipOptions {
  isInitialOpen?: boolean;
  isFlipDisabled?: boolean;
  isFocusListenerEnabled?: boolean;
  isHoverListenerEnabled?: boolean;
  strategy?: 'fixed' | 'absolute';
  offset?: OffsetOptions;
  onClose?: () => void;
  onOpen?: () => void;
  placement?: TooltipPlacement;
}

export type TooltipProps = Omit<TooltipBalloonProps, 'arrowRef' | 'arrowStyle'> &
  FloatingTooltipOptions & { content?: React.ReactNode };

export interface TooltipIconProps {
  children: React.ReactNode;
  id?: string;
  as?: React.ElementType;
}

export interface TooltipIconHandles {
  open: () => void;
  close: () => void;
}
