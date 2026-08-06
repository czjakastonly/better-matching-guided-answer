import React from 'react';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import { useDomId } from '@ui/utils/domId';
import Base from './FieldGroup.styles';
import type { FieldGroupProps } from './FieldGroup.types';

/**
 * A wrapper for the elements (to be used mostly with inputs/Field components) that ads label on top.
 * And that label will have the same styling/padding as label in inputs/Input components
 */
export const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ children, label, labelDomId, required, className, ...restDivProps }, forwardedRef) => {
    const labelId = useDomId(labelDomId);

    return (
      <Base.Container
        aria-labelledby={label ? labelId : undefined}
        {...restDivProps}
        className={mergeClassNames(className, STATIC_CLASS_NAME.fieldGroup)}
        ref={forwardedRef}
        role="group"
      >
        {label && (
          <Base.Label id={labelId}>
            {label}
            {required && label && <Base.RequiredLabelSuffix aria-hidden>*</Base.RequiredLabelSuffix>}
          </Base.Label>
        )}
        <Base.FieldsWrap>{children}</Base.FieldsWrap>
        {/* TODO @design-system - add message&status to be used by checkboxes */}
      </Base.Container>
    );
  }
);
