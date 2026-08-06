import React from 'react';

import { Portal } from '@ui/utils/Portal';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { zIndex } from '@ui/atoms/zIndex';
import TooltipStyles from '../_shared/Tooltip.styles';
import { type TooltipBalloonProps } from '../Tooltip.types';

/** Just a black "balloon" of tooltip */
export const TooltipBalloon = React.forwardRef<HTMLDivElement, TooltipBalloonProps>(
  ({ children, fitWidth, arrowRef, style, arrowStyle, id, maxWidthPx, ...rest }, forwardedRef) => {
    return (
      <Portal zIndex={zIndex.tooltip}>
        <TooltipStyles.BalloonWrap
          {...rest}
          className={STATIC_CLASS_NAME.tooltip}
          ref={forwardedRef}
          style={style}
          role="tooltip"
          id={id}
        >
          <TooltipStyles.BalloonBody fitWidth={fitWidth} maxWidthPx={maxWidthPx}>
            {children}
          </TooltipStyles.BalloonBody>
          <TooltipStyles.BalloonArrow ref={arrowRef} style={arrowStyle} />
        </TooltipStyles.BalloonWrap>
      </Portal>
    );
  }
);
