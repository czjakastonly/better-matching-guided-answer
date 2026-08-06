import styled from 'styled-components';

import { motion } from 'framer-motion';

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.color.backgroundBrand};
  opacity: 0.6;
`;

const Body = styled(motion.div).attrs({
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'spring', stiffness: 500, mass: 1, damping: 47 },
})`
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.backgroundDefault};
  box-shadow: ${({ theme }) => theme.shadows.basic};
  overflow: auto;
  display: flex;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  will-change: width;
  right: 0;
  @media screen and (min-width: 620px) {
    width: 480px;
  }
`;

const Container = styled(motion.div).attrs({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
})`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export { Backdrop, Container, Body };

export { AnimatePresence } from 'framer-motion';
