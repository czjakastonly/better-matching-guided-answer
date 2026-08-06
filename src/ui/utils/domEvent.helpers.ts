/** to be used e.g. in search input - we don't want pressing space trigger action of highlighted element */
export const isSpaceHandledByTargetEvent = (e: React.KeyboardEvent) => {
  // eslint-disable-next-line xss/no-mixed-html
  const target = e.target as HTMLInputElement | undefined;

  return (
    (target?.tagName?.toUpperCase() === 'INPUT' && ['TEXT', 'BUTTON'].includes(target?.type?.toUpperCase())) ||
    target?.tagName?.toUpperCase() === 'TEXTAREA' ||
    target?.getAttribute('contenteditable') === 'true'
  );
};
