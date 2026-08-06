import React, { useContext, useRef } from 'react';
import styled from 'styled-components';

/*
  why is this even needed? Because some other list-related component styling may have relation to it
  (ex. negative margin in ListHeader is the same as padding here)
*/
export const ListComponent = styled.div`
  position: relative;
  outline: none;
`;

const BodyRefContext = React.createContext<React.RefObject<HTMLDivElement> | null>(null);

export const List = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, forwardedRef) => {
  // will be used style <ListHeader> depending on <ListBody> scrollbar existence
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <BodyRefContext.Provider value={bodyRef}>
      <ListComponent {...props} ref={forwardedRef} />
    </BodyRefContext.Provider>
  );
});

export const useListBodyRef = () => {
  const bodyRefContextValue = useContext(BodyRefContext);

  if (!bodyRefContextValue) {
    console.log('STON.WARNING - ListHeader or ListBody outside List');
  }

  return bodyRefContextValue;
};
