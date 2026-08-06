import React, { useContext, useMemo, useState } from 'react';
import { produce } from 'immer';
import { uuidv4 } from '@stonlyCommons/helpers/randomValues';

export interface MessageToAdd {
  language: string;
  message: string;
  hasLanguageError?: boolean;
  hasMessageError?: boolean;
}

export interface MessageToAddMap {
  [key: string]: MessageToAdd;
}

interface CustomMessageContextType {
  customMessageMap: MessageToAddMap;
  setCustomMessageMap: (customMessage: MessageToAddMap) => void;
  addCustomMessage: () => void;
  editCustomMessageLanguage: (tempId: string, data: { language: string; hasLanguageError?: boolean }) => void;
  editCustomMessageContent: (tempId: string, data: { message: string; hasMessageError?: boolean }) => void;
  removeCustomMessage: (tempId: string) => void;
  customMessageLanguageList: string[];
  getCustomMessageByLanguage: () => { [key: string]: string };
  hasCustomMessagesError: boolean;
  validateCustomMessage: () => boolean;
}

const CustomMessageContext = React.createContext<CustomMessageContextType | undefined>(undefined);

export function CustomMessageDataProvider({
  children,
  initialCustomMessageMap = {},
}: {
  children: React.ReactNode;
  initialCustomMessageMap?: { [key: string]: string };
}) {
  const [customMessageMap, setCustomMessageMap] = useState<MessageToAddMap>(
    Object.fromEntries(
      Object.entries(initialCustomMessageMap).map(([language, message]) => [uuidv4(), { language, message }])
    )
  );

  const addCustomMessage = () => {
    setCustomMessageMap(prev => ({ ...prev, [uuidv4()]: { language: '', message: '' } }));
  };

  const removeCustomMessage = (tempId: string) => {
    const updatedCustomMessage = produce(customMessageMap, draft => {
      delete draft[tempId];
    });
    setCustomMessageMap(updatedCustomMessage);
  };

  const editCustomMessageLanguage = (tempId: string, data: { language: string; hasLanguageError?: boolean }) => {
    setCustomMessageMap(prev => ({
      ...prev,
      [tempId]: {
        ...prev[tempId],
        ...data,
      },
    }));
  };

  const editCustomMessageContent = (tempId: string, data: { message: string; hasMessageError?: boolean }) => {
    setCustomMessageMap(prev => ({
      ...prev,
      [tempId]: {
        ...prev[tempId],
        ...data,
      },
    }));
  };

  const validateCustomMessage = () => {
    const validatedCustomMessage = produce(customMessageMap, draft => {
      Object.values(draft).forEach(message => {
        message.hasMessageError = message.message.trim().length === 0;
        message.hasLanguageError = !message.language;
      });
    });
    setCustomMessageMap(validatedCustomMessage);
    const hasMessageError = Object.values(validatedCustomMessage).some(item => item.hasMessageError);
    const hasLanguageError = Object.values(validatedCustomMessage).some(item => item.hasLanguageError);

    return hasMessageError || hasLanguageError;
  };

  const customMessageLanguageList = Object.values(customMessageMap)
    .map(item => item.language)
    .filter(Boolean);

  const getCustomMessageByLanguage = () => {
    return Object.fromEntries(Object.values(customMessageMap).map(message => [message.language, message.message]));
  };

  const hasCustomMessagesError = !!Object.values(customMessageMap).find(
    ({ language, message }) => !language || !message.trim()
  );

  return (
    <CustomMessageContext.Provider
      value={useMemo(
        () => ({
          customMessageMap,
          setCustomMessageMap,
          addCustomMessage,
          editCustomMessageLanguage,
          editCustomMessageContent,
          removeCustomMessage,
          customMessageLanguageList,
          getCustomMessageByLanguage,
          hasCustomMessagesError,
          validateCustomMessage,
        }),
        [
          customMessageMap,
          setCustomMessageMap,
          addCustomMessage,
          editCustomMessageLanguage,
          editCustomMessageContent,
          removeCustomMessage,
          customMessageLanguageList,
          getCustomMessageByLanguage,
          hasCustomMessagesError,
          validateCustomMessage,
        ]
      )}
    >
      {children}
    </CustomMessageContext.Provider>
  );
}

export function useCustomMessage() {
  const context = useContext(CustomMessageContext);
  if (!context) {
    throw new Error('useCustomMessage must be used within a CustomMessageDataProvider');
  }

  return context;
}
