import { useContext } from 'react';
import { InteractionActionContainerContext } from './InteractionActionProvider';

export const useInteractionActionContainer = () => {
  const contextValue = useContext(InteractionActionContainerContext);

  if (!contextValue) {
    throw new Error('STON.ERROR.DEV - InteractionActionContainerContext accessed without provider');
  }

  return contextValue;
};
