import { useEffect } from 'react';

export const useSaveAiAutomationTab = (tabId: string) => {
  useEffect(() => {
    localStorage.setItem('ston-initial-ai-automation-tab-id', tabId);
  }, []);
};

export const getAiAutomationTab = () => {
  return localStorage.getItem('ston-initial-ai-automation-tab-id');
};
