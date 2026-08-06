import type React from 'react';
import { useStackNavigatorContext } from './StackNavigatorContext';
import { type StackNavigatorState } from './StackNavigator.types';

/**
 * Renders children only if it's in the NavigationStack context AND it's slug is the current slug.
 * Accepts children as component or render-children function fore easier usage.
 */
export const StackNavigationScreen = ({
  children,
  slug,
}: {
  children: React.ReactNode | ((props: { back?: StackNavigatorState['back'] }) => React.ReactNode); // children as component or function
  slug: string;
}) => {
  const navigator = useStackNavigatorContext();

  if (navigator && navigator.checkIsCurrentSlug(slug)) {
    if (typeof children === 'function') {
      return children({ back: navigator.back });
    }
    return children;
  }

  return null;
};
