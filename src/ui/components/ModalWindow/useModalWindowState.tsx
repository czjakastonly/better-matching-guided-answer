import { useMemo, useState } from 'react';

export const useModalWindowState = ({ initialOpen = false } = {}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  /* We are likely to have more logic here if wanted to have e.g. animation out */

  return useMemo(() => {
    return [isOpen, open, close, setIsOpen] as const;
  }, [isOpen]);
};
