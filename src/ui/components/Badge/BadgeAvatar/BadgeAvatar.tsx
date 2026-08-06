import React from 'react';

import { AvatarBadgeElement } from './BadgeAvatar.styles';

interface BadgeAvatarProps {
  size?: 'small' | 'large';
  children: React.ReactNode;
}

export const BadgeAvatar = ({ size = 'small', children }: BadgeAvatarProps) => (
  <AvatarBadgeElement $size={size}>{children}</AvatarBadgeElement>
);
