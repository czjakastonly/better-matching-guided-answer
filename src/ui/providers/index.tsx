import React from 'react';
import { LastEventProvider } from './LastEventProvider';
import { ImperativeModalWindowProvider } from './ImperativeModalWindowProvider';

/*
  All design-system providers merged into one.
  FUTURE: add more providers, add config maybe?
  FUTURE: it would be nice to apply theme provider here as well (but not possible until we migrate to ds fully)
*/
export default ({ children }: { children: React.ReactNode }) => {
  return (
    <LastEventProvider>
      <ImperativeModalWindowProvider>{children}</ImperativeModalWindowProvider>
    </LastEventProvider>
  );
};
