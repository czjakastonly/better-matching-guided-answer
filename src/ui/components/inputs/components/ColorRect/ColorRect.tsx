import React from 'react';
import styled, { useTheme } from 'styled-components';

const Svg = styled.svg`
  transform: scale(1.25); // 16px has to be changed to 20px
  transform-origin: center;
`;

/**
 * A 16px rectangle with provided color. To be used as preview of color on color inputs etc.
 */
export const ColorRect = ({ colorValue = '', disabled }: { colorValue?: string; disabled?: boolean }) => {
  const theme = useTheme();

  const backgroundStrokeColor = disabled ? theme.color.backgroundGraySubtle : theme.color.backgroundGrayDefault;
  const backgroundStrokeDasharray = disabled || !colorValue ? '4 4' : undefined;
  const foregroundPreviewColor = disabled ? theme.color.backgroundGraySubtle : colorValue;

  // Why two rectangles and not just rect with stroke/fill or div with border?
  // Because this component is prepared to handle all type of css colors like "lightgrey", "rgba(a,a,a,0.5)", '#ffa' along with invalid values.
  // The grey border becomes more visible on lighter colors (thanks to strokeOpacity) or on invalid colors
  // drawback is that the border is not 100% sharp on darker colors
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="19"
        rx="1.5"
        fill="none"
        stroke={backgroundStrokeColor}
        strokeWidth="1"
        strokeDasharray={backgroundStrokeDasharray}
      />
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="19"
        rx="1.5"
        fill={foregroundPreviewColor}
        stroke={foregroundPreviewColor}
        strokeOpacity="0.5"
        strokeWidth="1"
      />
    </Svg>
  );
};
