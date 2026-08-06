import { useEffect, useReducer } from 'react';

/**
 * Frontend-only mock of the Intent answer processing lifecycle (STON prototype).
 * The real state will come from the backend generation pipeline; until then, a saved
 * Intent answer is displayed as "Processing" for a fixed duration, then flips to its
 * regular status. Module-level so it survives dialog unmounts and table re-renders.
 */
export const INTENT_PROCESSING_MOCK_DURATION_MS = 5000;

const processingUntilBySourceId = new Map<number, number>();

export const markIntentProcessingMock = (searchSourceId: number) => {
  processingUntilBySourceId.set(searchSourceId, Date.now() + INTENT_PROCESSING_MOCK_DURATION_MS);
};

export const useIsIntentProcessingMock = (searchSourceId: number): boolean => {
  const [, forceRerender] = useReducer(count => count + 1, 0);
  const processingUntil = processingUntilBySourceId.get(searchSourceId) || 0;
  const isProcessing = processingUntil > Date.now();

  useEffect(() => {
    if (!isProcessing) {
      return undefined;
    }
    const timeoutId = setTimeout(() => {
      processingUntilBySourceId.delete(searchSourceId);
      forceRerender();
    }, processingUntil - Date.now());
    return () => clearTimeout(timeoutId);
  }, [isProcessing, processingUntil, searchSourceId]);

  return isProcessing;
};
