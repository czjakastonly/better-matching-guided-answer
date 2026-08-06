import React from 'react';

import { LabelBadgeElement } from './BadgeLabel.styles';

import { type BadgeLabelVariant } from './BadgeLabel.types';

interface BadgeLabelProps {
  variant?: BadgeLabelVariant;
  children: React.ReactNode;
}

export const BadgeLabel = ({ variant = 'neutral', children }: BadgeLabelProps) => (
  <LabelBadgeElement $variant={variant}>{children}</LabelBadgeElement>
);
