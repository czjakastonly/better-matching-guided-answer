import React from 'react';
import { Dot, DotsWrap } from './Loader.styles';
import type { LoaderProps } from './Loader.types';

export const Loader = ({ isDark }: LoaderProps) => (
  <DotsWrap isDark={isDark}>
    <Dot />
    <Dot />
    <Dot />
  </DotsWrap>
);
