import React, { useRef } from 'react';
import styled, { css } from 'styled-components';

import { useMergeRefs } from '@ui/utils/mergeRefs';
import SearchSVG from '@ui/atoms/icons/Search.svg';
import CrossSVG from '@ui/atoms/icons/CrossSmall.svg';
import { ListItemStyles } from './_shared/styles';

export interface ListSearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  onChangeValue?: (val: string) => void;
  value: string;
  className?: never;
}

const CrossIcon = styled(CrossSVG)<{ $isVisible?: boolean }>`
  margin-left: auto;
  margin-top: 4px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
  display: none;

  path {
    fill: ${props => props.theme.color.iconDefault};
  }

  ${({ $isVisible }) =>
    $isVisible &&
    css`
      display: block;
    `}
`;

const InputElement = styled.input`
  ${props => props.theme.typography.uiElement};
  width: 100%;
  border: none;
  outline: none;
  padding: 0;
  color: ${props => props.theme.color.textDark};

  &::placeholder {
    color: ${props => props.theme.color.textPlaceholder};
  }
`;

export const ListSearchInput = React.forwardRef<HTMLInputElement, ListSearchInputProps>(
  (
    {
      onChangeValue,
      value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      className: _,
      ...restTextInputAttributes
    },
    forwardedRef
  ) => {
    const inputRefInternal = useRef<HTMLInputElement>(null);
    const inputRef = useMergeRefs<HTMLInputElement>(inputRefInternal, forwardedRef);

    const handleContainerClick = () => {
      if (inputRefInternal.current) {
        inputRefInternal.current.focus();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeValue?.(e.target.value);
    };

    return (
      <ListItemStyles.Container onClick={handleContainerClick}>
        <ListItemStyles.LeftIconContainer aria-hidden>
          <SearchSVG />
        </ListItemStyles.LeftIconContainer>
        <ListItemStyles.TextContainer>
          <InputElement {...restTextInputAttributes} onChange={handleChange} ref={inputRef} value={value} />
        </ListItemStyles.TextContainer>
        <CrossIcon aria-hidden $isVisible={!!value} onClick={() => onChangeValue?.('')} />
      </ListItemStyles.Container>
    );
  }
);
