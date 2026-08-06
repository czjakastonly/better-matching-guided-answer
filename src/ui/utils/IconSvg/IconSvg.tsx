import React from 'react';
import styled, { useTheme } from 'styled-components';
import HelpSVG from '@ui/atoms/icons/Help-16.svg';
import type { IconSvgProps } from './IconSvg.types';

export const ColoredSvg = styled.svg`
  path:not(.color-frozen) {
    fill: currentColor !important;
  }
  circle:not(.color-frozen) {
    fill: currentColor !important;
  }
`;

/**
 * Icon-like component that renders svg with provided color (a path's fill color)
 */
export const IconSvg = ({ color, as: SvgIcon = HelpSVG, ...rest }: IconSvgProps) => {
  const theme = useTheme();
  const fillColor = typeof color === 'function' ? color(theme) : color;

  return <ColoredSvg {...rest} as={SvgIcon} style={{ ...rest.style, color: fillColor }} />;
};
