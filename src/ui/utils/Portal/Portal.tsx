import type { ReactNode, ReactPortal } from 'react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { zIndex, type ZIndexType } from '@ui/atoms/zIndex';
import { useDomId } from '@ui/utils/domId';
import { STATIC_CLASS_NAME } from '@ui/constants';

export interface PortalProps {
  children: ReactNode;
  zIndex?: ZIndexType | number;
}

const DOM_CLEANUP_TIMEOUT = 100;
const PORTAL_Z_INDEX = zIndex.modal; // we don't need useTheme dependency here i hope

const createPortalNode = (id: string, propsZIndex: ZIndexType | number = PORTAL_Z_INDEX): HTMLDivElement => {
  const el = document.createElement('div');
  if (id) {
    el.setAttribute('id', id);
  }
  el.className = STATIC_CLASS_NAME.portal;
  el.style.position = 'relative';
  el.style.zIndex = String(propsZIndex); // @Michał - max allowed index for design system? theme.zIndexes?
  document.body.append(el);

  return el;
};

export const Portal = ({ children, zIndex: propsZIndex }: PortalProps): ReactPortal | null => {
  const [container, setContainer] = useState<HTMLElement>();
  const domId = useDomId();

  useEffect(() => {
    setContainer(document.getElementById(domId) || createPortalNode(domId, propsZIndex));

    return () => {
      if (!container) return;

      setTimeout(() => {
        if (container.innerHTML === '') container.remove();
      }, DOM_CLEANUP_TIMEOUT);
    };
  }, [container, domId]);

  return container ? createPortal(children, container) : null;
};
