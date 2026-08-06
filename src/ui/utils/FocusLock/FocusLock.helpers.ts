import { type FocusableElement, tabbable } from 'tabbable';
import { STATIC_CLASS_NAME } from '@ui/constants';

const getFocusableNodes = (element: Element) => {
  return tabbable(element, { includeContainer: true, displayCheck: 'full', getShadowRoot: false });
};

export const handleFocusLockTabPress = (element: Element, event: KeyboardEvent) => {
  const focusableNodes = getFocusableNodes(element);
  if (!focusableNodes.length) {
    return undefined;
  }

  const focusedElement = focusableNodes[0];

  if (element.contains(document.activeElement)) {
    const focusedItemIndex = focusableNodes.indexOf(document.activeElement as FocusableElement);
    if (event.shiftKey && focusedItemIndex === 0) {
      focusableNodes[focusableNodes.length - 1].focus();
      event.preventDefault();
    }
    if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
      focusedElement.focus();
      event.preventDefault();
    }
    return focusableNodes[focusedItemIndex];
  }
  focusedElement.focus();
  event.preventDefault();

  return focusedElement;
};

/** Check if the element is inside top-most focusLock */
export const getIsElementTopFocusLock = (focusLockContainer?: HTMLElement | null) => {
  if (!focusLockContainer) {
    return false;
  }

  // case when element is not FocusLock container
  if (!focusLockContainer.className.includes(STATIC_CLASS_NAME.focusLocked)) {
    console.warn('STON:WARNING - getIsElementTopFocusLock executed with the element without proper className');
    return false;
  }

  // case when element has another FocusLock inside in dom tree. (not in portals)
  if (focusLockContainer.querySelectorAll(`.${STATIC_CLASS_NAME.focusLocked}`).length) {
    return false;
  }

  // case when there are active portals with FocusLock. This one has to be inside the latest
  const focusLockInPortalList = document.querySelectorAll(
    `body > .${STATIC_CLASS_NAME.portal} .${STATIC_CLASS_NAME.focusLocked}`
  );
  if (focusLockInPortalList.length) {
    return focusLockInPortalList[focusLockInPortalList.length - 1] === focusLockContainer;
  }

  return true;
};
