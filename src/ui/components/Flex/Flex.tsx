import React, { forwardRef, useMemo } from 'react';
import type { FlexProps } from './Flex.types';
import { Canvas } from './Flex.styles';
import { calcValue, combineSpacingValues } from './Flex.helpers';

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      children,
      display = 'flex',
      reverse,
      style,
      //
      alignItems,
      justifyContent,
      direction,
      flexWrap,
      //
      flexGrow,
      flexShrink,
      flexBasis,
      //
      gap,
      //
      margin,
      marginX,
      marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      //
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      position,
      ...restDivProps
    },
    ref
  ) => {
    const calculatedMargin = useMemo(
      () => combineSpacingValues(margin, marginX, marginY, marginTop, marginRight, marginBottom, marginLeft),
      [margin, marginX, marginY, marginTop, marginRight, marginBottom, marginLeft]
    );

    const calculatedPadding = useMemo(
      () => combineSpacingValues(padding, paddingX, paddingY, paddingTop, paddingRight, paddingBottom, paddingLeft),
      [padding, paddingX, paddingY, paddingTop, paddingRight, paddingBottom, paddingLeft]
    );

    return (
      <Canvas
        {...restDivProps}
        ref={ref}
        className={className}
        $display={display}
        $reverse={reverse}
        //
        $alignItems={alignItems}
        $justifyContent={justifyContent}
        $direction={direction}
        $flexWrap={flexWrap}
        //
        $flexGrow={flexGrow}
        $flexShrink={flexShrink}
        $flexBasis={flexBasis}
        //
        $gap={calcValue(gap)}
        $margin={calculatedMargin}
        $padding={calculatedPadding}
        $position={position}
        style={style}
      >
        {children}
      </Canvas>
    );
  }
);

export const RowFlex = forwardRef<HTMLDivElement, FlexProps>((props: FlexProps, ref) => {
  return <Flex {...props} ref={ref} direction="row" />;
});

export const ColumnFlex = forwardRef<HTMLDivElement, FlexProps>((props: FlexProps, ref) => {
  return <Flex {...props} ref={ref} direction="column" />;
});
