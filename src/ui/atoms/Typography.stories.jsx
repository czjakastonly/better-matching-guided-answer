import React from 'react';
import styled, { useTheme } from 'styled-components';
import { getDesignLink } from '@ui/designLinks';

const Text = styled.div`
  ${props => props.typography};
  margin: 10px 0;
`;

export default {
  title: 'Design System/Atoms/Typography',
  parameters: {
    ...getDesignLink('Typography'),
  },
};

export const Typography = () => {
  const theme = useTheme();
  const { typography } = theme;
  return (
    <>
      {Object.keys(typography).map(key => {
        return (
          <Text key={key} typography={typography[key]}>
            {key}
          </Text>
        );
      })}
    </>
  );
};
