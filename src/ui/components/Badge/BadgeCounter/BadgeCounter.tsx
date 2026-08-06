import React from 'react';

import { CounterBadgeElement } from './BadgeCounter.styles';

interface BadgeCounterProps {
  variant?: 'default' | 'important';
  children: React.ReactNode;
}

export const BadgeCounter = ({ variant = 'default', children }: BadgeCounterProps) => (
  <CounterBadgeElement $variant={variant}>{children}</CounterBadgeElement>
);
