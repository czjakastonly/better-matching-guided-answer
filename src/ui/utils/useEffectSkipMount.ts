import { useEffect, useRef } from 'react';

/** works like a regular useEffect but skips the first run on mount */
export function useEffectSkipMount(effect: () => void | (() => void), deps: ReadonlyArray<unknown>) {
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
