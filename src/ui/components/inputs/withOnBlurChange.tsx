import React, { useCallback, useEffect, useState } from 'react';

interface MandatoryComponentProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeValue?: (value: string, name?: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  disabled?: boolean;
}

export function withOnBlurChange<T extends MandatoryComponentProps>(Component: React.ComponentType<T>) {
  return (props: Omit<T, keyof MandatoryComponentProps> & MandatoryComponentProps) => {
    const { onChange, onChangeValue, onBlur, value = '', name = '', disabled = false, ...rest } = props;
    const [localValue, setLocalValue] = useState(value);

    const handleBlurProxy = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (!disabled) {
          onChange?.(e);
          onChangeValue?.(e.target.value, name);
        }
        onBlur?.(e);
      },
      [onChange, onChangeValue, onBlur, name, disabled]
    );

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    return (
      <Component
        {...(rest as T)}
        name={name}
        disabled={disabled}
        value={localValue}
        onChange={undefined}
        onChangeValue={setLocalValue}
        onBlur={handleBlurProxy}
      />
    );
  };
}
