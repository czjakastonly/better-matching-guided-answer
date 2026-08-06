import { useRef, useState, useEffect, useCallback } from 'react';

export function useIsOverflowing<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = useCallback(() => {
    if (ref.current) {
      setIsOverflowing(ref.current.scrollWidth > ref.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    checkOverflow();

    const el = ref.current;
    if (!el) return undefined;

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [checkOverflow]);

  return { ref, isOverflowing };
}
