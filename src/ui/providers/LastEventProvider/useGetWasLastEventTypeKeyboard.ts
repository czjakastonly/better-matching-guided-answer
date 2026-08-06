import { useContext } from 'react';
import { LastEventContext } from './LastEventProvider';

export function useGetWasLastEventTypeKeyboard() {
  const context = useContext(LastEventContext);

  if (context === undefined) {
    throw new Error('useGetWasLastEventTypeKeyboard must be used within a LastEventProvider');
  }

  return context.getWasLastEventTypeKeyboard;
}
