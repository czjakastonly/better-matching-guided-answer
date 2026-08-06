import React, { cloneElement, isValidElement } from 'react';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { generateDescribeDomId, useDomId } from '@ui/utils/domId';
import TooltipStyles from './_shared/Tooltip.styles';
import { useFloatingTooltip } from './useFloatingTooltip';
import { TooltipBalloon } from './components/TooltipBalloon';
import { type TooltipProps } from './Tooltip.types';

export const Tooltip = ({
  children,
  content,
  placement,
  isInitialOpen,
  isFlipDisabled,
  isFocusListenerEnabled,
  isHoverListenerEnabled,
  strategy,
  offset,
  id,
  ...tooltipBalloonProps
}: TooltipProps) => {
  const { isOpen, triggerProps, arrowProps, floatingProps, open, close } = useFloatingTooltip({
    placement,
    isInitialOpen,
    isFlipDisabled,
    isFocusListenerEnabled,
    isHoverListenerEnabled,
    strategy,
    offset,
  });

  const domId = useDomId(id);
  const shouldShowBalloon = isOpen && !!content;
  const balloonId = generateDescribeDomId(domId, shouldShowBalloon);

  return (
    <>
      <TooltipStyles.TriggerWrap
        className={STATIC_CLASS_NAME.tooltipTrigger}
        {...triggerProps}
        onFocus={open}
        onBlur={close}
      >
        {isValidElement(children)
          ? cloneElement(children as React.ReactElement, { 'aria-describedby': balloonId })
          : children}
      </TooltipStyles.TriggerWrap>
      {shouldShowBalloon ? (
        <TooltipBalloon
          role="tooltip"
          {...tooltipBalloonProps}
          {...floatingProps}
          arrowRef={arrowProps.ref}
          arrowStyle={arrowProps.style}
          id={balloonId}
        >
          {content}
        </TooltipBalloon>
      ) : null}
    </>
  );
};
