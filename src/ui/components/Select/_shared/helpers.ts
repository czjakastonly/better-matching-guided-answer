import type React from 'react';
import { type SelectOptionPayload } from './types';

/* takes react child and check if it contains props that are specific for Select's option */
export function findOptionDataInReactChild(child: unknown) {
  const childProps = (child as React.ReactElement)?.props as { value?: string | number | object } | undefined; // tmp @design-system todo - generic value for <Select / ListBox>

  // We allow for putting value="", value={0} or value={object}
  if (!!childProps && ['string', 'number', 'object'].includes(typeof childProps.value)) {
    return childProps as SelectOptionPayload;
  }

  // TODO @design-system - make it search recursively (to search in fragments etc.)
  return undefined;
}
