import styled from 'styled-components';

import { motion } from 'framer-motion';

const Body = styled(motion.div)`
  position: relative;
  display: block;
  background-color: ${({ theme }) => theme.color.backgroundDefault};
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  ${props => props.theme.scrollbars.basic};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export { Container, Body };

export { AnimatePresence } from 'framer-motion';
