import React, { useContext } from 'react';
import { type StackNavigatorState } from './StackNavigator.types';

export const StackNavigatorContext = React.createContext<StackNavigatorState | undefined>(undefined);

export const useStackNavigatorContext = () => useContext(StackNavigatorContext);
