import React from 'react';
import styled from 'styled-components';
import type { IconSrcProps } from './IconSrc.types';

export const Image = styled.span`
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

/**
 * Icon-like component that displays it's image from provided url (instead of direct svg)
 * as background-image.
 */
export const IconSrc = ({
  backgroundImageUrl,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconSrcProps) => {
  const srcArr = Array.isArray(backgroundImageUrl) ? backgroundImageUrl : [backgroundImageUrl];
  const backgroundImage = srcArr.map(url => `url(${url})`).join(', ');

  return <Image className={className} style={{ backgroundImage }} aria-label={ariaLabel} aria-hidden={ariaHidden} />;
};
