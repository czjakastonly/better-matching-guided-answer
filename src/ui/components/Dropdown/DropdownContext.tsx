import React, { useContext } from 'react';
import { type DropdownContextValue } from './Dropdown.types';

export const DropdownContext = React.createContext<DropdownContextValue | undefined>(undefined);

export const useDropdownContext = () => {
  return useContext(DropdownContext);
};
