import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const Canvas = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 1px;
  z-index: 10;
  background: ${props => props.theme.silver};
  opacity: 0;

  ${({ show }) =>
    show &&
    css`
      opacity: 1;
    `}
`;

const Divider = ({ className, scrollableElementRef, scrollTop }) => {
  const [show, setShow] = useState(false);

  const onScroll = useCallback(() => {
    setShow(scrollableElementRef.current.scrollTop > scrollTop);
  }, [scrollableElementRef.current]);

  useEffect(() => {
    if (scrollableElementRef.current) scrollableElementRef.current.addEventListener('scroll', onScroll);
    return () => {
      if (scrollableElementRef.current) scrollableElementRef.current.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <Canvas show={show} className={className} />;
};

Divider.propTypes = {
  className: PropTypes.string,
  scrollableElementRef: PropTypes.object,
  scrollTop: PropTypes.number,
};

export default Divider;
