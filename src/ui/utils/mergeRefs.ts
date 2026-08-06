import { useCallback } from 'react';
import type { ForwardedRef } from 'react';

type PossibleRef<T> = ForwardedRef<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

/**
 * Merges multiple refs.
 * Both types: callback refs and RefObject(s)
 */
function mergeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach(ref => setRef(ref, node));
}

/**
 * A hook merging multiple refs with memoization.
 * Both types: callback refs and RefObject(s)
 */
function useMergeRefs<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs);
}

export { mergeRefs, useMergeRefs };
