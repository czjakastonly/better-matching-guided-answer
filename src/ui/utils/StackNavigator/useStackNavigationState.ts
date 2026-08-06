import { useCallback, useMemo, useState } from 'react';
import { useStackNavigatorContext } from './StackNavigatorContext';
import { type StackNavigatorState } from './StackNavigator.types';

export const useStackNavigationState = (slug: string) => {
  const parentNavigator = useStackNavigatorContext(); // navigators can be nested.
  const isNested = !!parentNavigator;

  /*
    Local stack for this navigator (only matters if root or active nested)
  */
  const [navigationStack, setNavigationStack] = useState([slug]);

  /*
    Push a new state onto navigation stack
  */
  const pushState = useCallback((path: string) => setNavigationStack(prev => [...prev, path]), []);

  /*
    Go back one state on the navigation stack.
    If root (first item in stack array) then back goes to parent navigator if such exists
  */
  const back = useCallback(() => {
    if (!isNested) {
      // root navigator handles its own back
      setNavigationStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    } else if (navigationStack.at(-1) === slug) {
      // nested: if we're at root of nested navigator, go back in parent
      parentNavigator.back();
    } else {
      setNavigationStack(prev => prev.slice(0, -1));
    }
  }, [isNested, parentNavigator, navigationStack, slug]);

  const reset = useCallback(() => setNavigationStack([slug]), [slug]);

  const canGoBack = useMemo(() => {
    if (!isNested) {
      return navigationStack.length > 1;
    }
    if (navigationStack.at(-1) === slug) {
      return !!parentNavigator?.canGoBack;
    }
    return navigationStack.length > 1;
  }, [isNested, navigationStack, parentNavigator, slug]);

  /*
    Function to check if the given slug is the current in navigation stack
  */
  const checkIsCurrentSlug = useCallback(s => navigationStack.at(-1) === s, [navigationStack]);

  const isActive = useMemo(() => {
    // A nested navigator is visible only if parent shows its slug
    return !isNested || parentNavigator?.checkIsCurrentSlug(slug);
  }, [isNested, parentNavigator, slug]);

  return useMemo<StackNavigatorState>(
    () => ({
      pushState,
      back,
      reset,
      navigationStack,
      rootSlug: slug,
      isActive,
      checkIsCurrentSlug,
      isNested,
      canGoBack,
    }),
    [pushState, back, reset, navigationStack, slug, isActive, checkIsCurrentSlug, isNested, canGoBack]
  );
};
