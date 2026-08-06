export interface StackNavigatorState {
  pushState: (path: string) => void;
  back: () => void;
  reset: () => void;
  navigationStack: string[];
  rootSlug: string;
  isActive: boolean;
  checkIsCurrentSlug: (slug: string) => boolean;
  canGoBack: boolean;
  isNested: boolean;
}
