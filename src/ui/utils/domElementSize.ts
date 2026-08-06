import type { MutableRefObject } from 'react';
import { useState, useEffect, useCallback } from 'react';

export const useDomElementSize = <T extends HTMLElement>(ref?: MutableRefObject<T | null>) => {
  const [refWidth, setRefWidth] = useState<number>(); // compute more when needed

  const calcRefWidth = useCallback(() => {
    if (ref && ref.current) {
      setRefWidth(ref.current.clientWidth);
    }
  }, [ref]);

  useEffect(() => {
    calcRefWidth();
    if (ref && ref.current) {
      window.addEventListener('resize', calcRefWidth); // what if we change e.g. panel's size? should "drag" be added?
    }
    return () => {
      window.removeEventListener('resize', calcRefWidth);
    };
  }, [ref, calcRefWidth]);

  return { width: refWidth };
};
