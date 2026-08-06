export const mergeClassNames = (...args: Array<string | string[] | undefined | null>) => {
  const mergedClassString = [args].flat(Number.POSITIVE_INFINITY).filter(Boolean).join(' ');
  return mergedClassString || undefined;
};
