import { useMemo } from 'react';

/** Returns passed id or stable random id if not provided */
export const useDomId = (id?: string) => {
  return useMemo(() => id || `x${Math.random().toString(36).slice(2)}`, [id]);
};

/** returns prefixed domId if provided some + condition is not falsy */
export const generateErrorMessageDomId = (id?: string, condition = true) => {
  return condition && id ? `errormessage-for-${id}` : undefined;
};

/** returns prefixed domId if provided some + condition is not falsy */
export const generateLabelDomId = (id?: string, condition = true) => {
  return id && condition ? `label-for-${id}` : undefined;
};

/** returns prefixed domId if provided some + condition is not falsy */
export const generateDescribeDomId = (id?: string, condition = true) => {
  return id && condition ? `describe-for-${id}` : undefined;
};

/** returns prefixed domId if provided some + condition is not falsy */
export const generateListboxDomId = (id?: string, condition = true) => {
  return id && condition ? `listbox-for-${id}` : undefined;
};

/** returns prefixed domId if provided some + condition is not falsy */
export const generateDialogDomId = (id?: string, condition = true) => {
  return id && condition ? `dialog-for-${id}` : undefined;
};
