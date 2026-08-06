import generateTempId from 'helpers/randomValues';

export const getEnsuredElementId = (
  element: HTMLElement | null | undefined,
  id = generateTempId()
): string | undefined => {
  if (!element || typeof element.setAttribute !== 'function') {
    return;
  }

  if (!element.id) {
    element.setAttribute('id', `${id}`);
  }

  return element.id;
};
