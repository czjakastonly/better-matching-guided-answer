import React, { useImperativeHandle } from 'react';
import HelpSVG from '@ui/atoms/icons/Help-16.svg';
import { generateDescribeDomId, useDomId } from '@ui/utils/domId';
import { VisuallyHidden } from '@ui/components/VisuallyHidden';
import { TooltipBalloon } from './components/TooltipBalloon';
import { useFloatingTooltip } from './useFloatingTooltip';
import TooltipStyles from './_shared/Tooltip.styles';
import { type TooltipIconProps, type TooltipIconHandles } from './Tooltip.types';

/**
 * Icon with tooltip on hover/focus. By default, it uses HelpSVG icon.
 */
export const TooltipIcon = React.forwardRef<TooltipIconHandles, TooltipIconProps>(
  ({ children, id, as: TriggerIcon = HelpSVG }, forwardedRef) => {
    const { isOpen, triggerProps, arrowProps, floatingProps, open, close } = useFloatingTooltip({
      placement: 'top',
      isInitialOpen: false,
    });

    const triggerId = useDomId(id);
    const balloonId = generateDescribeDomId(triggerId);

    useImperativeHandle(
      forwardedRef,
      () => ({
        open,
        close,
      }),
      [open, close]
    );

    return (
      <>
        <TooltipStyles.TriggerIconWrapper {...triggerProps} id={triggerId} tabIndex={0}>
          <TriggerIcon aria-describedby={balloonId} aria-label="more info" />
          <VisuallyHidden /* a11y - it worked unstable without static hidden content (tried with ballon having role="tooltip") */
            id={balloonId}
            role="tooltip"
          >
            {children}
          </VisuallyHidden>
        </TooltipStyles.TriggerIconWrapper>
        {isOpen && (
          <TooltipBalloon aria-hidden {...floatingProps} arrowRef={arrowProps.ref} arrowStyle={arrowProps.style}>
            {children}
          </TooltipBalloon>
        )}
      </>
    );
  }
);
