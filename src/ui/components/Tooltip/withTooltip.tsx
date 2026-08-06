import React from 'react';
import { Tooltip } from './Tooltip';
import { type FloatingTooltipOptions } from './Tooltip.types';

interface WithTooltipComponentProps {
  tooltipContent?: React.ReactNode;
}

/**
 * Produces component that will accept "content" prop, and will be wrapped with tooltip
 */
export function withTooltip<T>(
  Trigger: React.ComponentType<T>,
  tooltipOptions: FloatingTooltipOptions & WithTooltipComponentProps
) {
  return React.forwardRef<HTMLElement, T & WithTooltipComponentProps>((props, ref) => {
    const { tooltipContent, ...componentProps } = props;

    return (
      <Tooltip {...tooltipOptions} content={tooltipContent}>
        <Trigger ref={ref} {...(componentProps as T)} />
      </Tooltip>
    );
  });
}
