import React from 'react';
import { useStackNavigationState } from './useStackNavigationState';
import { StackNavigatorContext } from './StackNavigatorContext';
import { type StackNavigatorState } from './StackNavigator.types';

/**
 * Container for a StackNavigation scope
 */
type StackNavigatorProps =
  | { children: React.ReactNode; navigator: StackNavigatorState; slug?: never }
  | { children: React.ReactNode; navigator?: never; slug: string };

export const StackNavigator = ({ children, navigator: xorNavigator, slug: xorInitialSlug }: StackNavigatorProps) => {
  const slug = (xorNavigator && xorNavigator.rootSlug) || xorInitialSlug;

  const selfNavigator = xorNavigator || useStackNavigationState(slug);

  if (!selfNavigator.isActive) return null;

  return <StackNavigatorContext.Provider value={selfNavigator}>{children}</StackNavigatorContext.Provider>;
};
