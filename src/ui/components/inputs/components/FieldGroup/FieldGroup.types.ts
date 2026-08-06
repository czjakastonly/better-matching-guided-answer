import type React from 'react';

type ForbiddenProps = 'role';

export interface FieldGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, ForbiddenProps> {
  children?: React.ReactNode;
  id?: string;
  label?: React.ReactNode;
  labelDomId?: string;
  required?: boolean;
}
