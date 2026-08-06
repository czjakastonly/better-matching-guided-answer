import { useContext, useMemo } from 'react';
import { InteractionSelectContext } from './InteractionSelectProvider';

export const useInteractionSelectItem = ({ value, uuid }: { value?: string; uuid?: string }) => {
  const contextValue = useContext(InteractionSelectContext);

  if (!contextValue) {
    throw new Error('STON.ERROR.MissingContext.InteractionSelectContext');
  }

  const { selectedValue } = contextValue;

  const isSelected =
    !!value && (Array.isArray(selectedValue) ? selectedValue.includes(value) : selectedValue === value);

  return useMemo(
    () => ({
      isSelected,
      uuid, // re-export
    }),
    [isSelected, uuid]
  );
};
