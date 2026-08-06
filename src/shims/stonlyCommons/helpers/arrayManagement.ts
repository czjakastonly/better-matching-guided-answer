export const mergeRefs = (...refs: any[]) => (value: any) => {
  refs.forEach(ref => {
    if (typeof ref === 'function') ref(value);
    else if (ref != null) ref.current = value;
  });
};
