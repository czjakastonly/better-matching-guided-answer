import React, { useContext } from 'react';

export const ContentWrapRefContext = React.createContext<React.RefObject<HTMLDivElement> | null>(null);

/**
 * Context for getting the ref of the content wrap of the dialog.
 * To be used e.g. in Header to detect if the content has scrollbar/is scrolled and show a separator.
 */
export const useContentWrapRef = () => {
  const contentWrapRef = useContext(ContentWrapRefContext);

  if (!contentWrapRef) {
    // eslint-disable-next-line no-console
    console.log('STON.WARNING - useContentWrapRef outside ContentWrapRefContext');
  }

  return contentWrapRef;
};
