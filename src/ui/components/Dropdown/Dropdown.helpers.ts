import { STATIC_CLASS_NAME } from '@ui/constants';

/**
 *  Check if the element on top of all dropdowns.
 *  Actually, it checks if element is in the latest (in DOM order) portal except tooltips.
 *  If we make tooltips closable by esc, then this one will need some modification
 */
export const getIsElementTopDropdown = (floatingElement?: HTMLElement | null) => {
  if (!floatingElement) {
    return false;
  }

  // portals that are not used by tooltips
  const portals = document.querySelectorAll(
    `body >.${STATIC_CLASS_NAME.portal}:not(:has( >.${STATIC_CLASS_NAME.tooltip}))` // "body >.ston-portal:not(:has( >.ston-tooltip-main))""
  );
  if (portals.length) {
    return portals[portals.length - 1].contains(floatingElement);
  }

  return true;
};
