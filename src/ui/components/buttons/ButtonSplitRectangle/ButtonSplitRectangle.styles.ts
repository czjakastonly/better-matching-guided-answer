import styled from 'styled-components';
import { ButtonStyles } from '../_shared/styles';

export const Container = styled.div`
  display: inline-flex;
  width: 100%;

  & > *:focus-visible {
    z-index: 1;
  }

  & > ${ButtonStyles.OutlineButtonElement} {
    height: 40px;
    border-radius: 0;
    border-color: ${({ theme }) => theme.color.borderSuccess};

    &:hover,
    &:active,
    &:focus-visible {
      border-color: ${({ theme }) => theme.color.borderSuccess};
    }

    &:first-child {
      flex: 1;
      min-width: 0;
      justify-content: flex-start;

      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;

      /* IconWrapLoader is absolutely positioned without offsets, so it
         normally lands at the flex child's static position. Overriding
         justify-content to flex-start would pin it to the left — recenter
         it explicitly so the loading spinner stays in the middle. */
      ${ButtonStyles.IconWrapLoader} {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &:not(:first-child) {
      margin-left: -1px;
    }
  }
`;
