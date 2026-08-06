import React from 'react';
import styled, { useTheme } from 'styled-components';
import { getDesignLink } from '@ui/designLinks';

const Box = styled.div`
  box-shadow: ${props => props.shadow};
  width: 200px;
  height: 100px;
  margin: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 1000px;
`;

export default {
  title: 'Design System/Atoms/Shadows',
  parameters: {
    ...getDesignLink('Shadows'),
  },
};
export const Shadows = () => {
  const theme = useTheme();
  return (
    <Container>
      <Box shadow={theme.shadows.basic}>Basic</Box>
      <Box shadow={theme.shadows.light}>Light</Box>
      <Box shadow={theme.shadows.medium}>Medium</Box>
      <Box shadow={theme.shadows.strong}>Strong</Box>
    </Container>
  );
};
