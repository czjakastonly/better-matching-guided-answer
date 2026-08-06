export const onKeyDownToOnClick = (event: any) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click?.();
  }
};
