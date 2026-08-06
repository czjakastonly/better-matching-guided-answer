import { useEffect, useState, useRef } from 'react';
import { css } from 'styled-components';

export const textOverflowEllipsisStyle = css`
  text-overflow: ellipsis;
  overflow-x: hidden;
  // prevents showing title when text overflowing on Safari
  &::after {
    content: '';
    display: block;
  }
`;

export const useTextIsOverflowing = () => {
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkIsOverflowing = () => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollWidth > textRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    checkIsOverflowing();
  }, [textRef.current]);

  return { textRef, isOverflowing, checkIsOverflowing };
};
