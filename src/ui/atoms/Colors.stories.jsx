import React from 'react';
import styled, { useTheme } from 'styled-components';
import { getDesignLink } from '@ui/designLinks';
import { PALETTE } from './colors';
import ArticleSVG from './icons/Article-color-40.svg';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
  width: ${props => props.width}px;
  * {
    box-sizing: border-box;
  }
`;

const Square = styled.div`
  background-color: ${props => props.bgColor || 'transparent'};
  color: ${props => props.color};
  border: ${props => (props.borderColor ? `2px solid ${props.borderColor}` : 'none')};
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
`;

const TextWrapper = styled.div`
  background-color: ${props => (props.color === '#FFFFFF' || props.color === '#fff' ? '#eaeaea' : 'transparent')};
  font-size: 20px;
  color: ${props => props.color};
  height: 20px;
  width: 150px;
`;

const ArticleIcon = styled(ArticleSVG)`
  background-color: ${props => (props.color === '#FFFFFF' || props.color === '#fff' ? '#eaeaea' : 'transparent')};

  path {
    fill: ${props => props.color};
  }
`;

const ColorWrapper = ({ style, bgColor, borderColor, children, caption, icon }) => {
  return (
    <Wrapper style={style}>
      <Square bgColor={bgColor} borderColor={borderColor}>
        {children}
        {icon}
      </Square>
      {caption}
    </Wrapper>
  );
};

export default {
  title: 'Design System/Atoms/Colors',
  component: ColorWrapper,
};

export const Palette = () => {
  return (
    <Container width={700}>
      {Object.keys(PALETTE).map(key => {
        return (
          <ColorWrapper key={key} bgColor={PALETTE[key]} text={key}>
            {key}
          </ColorWrapper>
        );
      })}
    </Container>
  );
};

Palette.parameters = getDesignLink('ColorsPalette');

export const Text = () => {
  const theme = useTheme();
  const textColors = Object.fromEntries(
    Object.entries(theme.color)
      .filter(([key]) => key.startsWith('text'))
      .map(([key, value]) => [key, value])
  );
  return (
    <Container width={700} style={{ gap: '8px' }}>
      {Object.keys(textColors).map(key => {
        return (
          <TextWrapper key={key} color={textColors[key]}>
            {key}
          </TextWrapper>
        );
      })}
    </Container>
  );
};

Text.parameters = getDesignLink('ColorsText');

export const Background = () => {
  const theme = useTheme();
  const textColors = Object.fromEntries(
    Object.entries(theme.color)
      .filter(([key]) => key.startsWith('background'))
      .map(([key, value]) => [key, value])
  );
  return (
    <Container width={700} style={{ gap: '8px' }}>
      {Object.keys(textColors).map(key => {
        return <ColorWrapper key={key} bgColor={textColors[key]} caption={key} style={{ fontSize: '8px' }} />;
      })}
    </Container>
  );
};

Background.parameters = getDesignLink('ColorsBackground');

export const Icon = () => {
  const theme = useTheme();
  const textColors = Object.fromEntries(
    Object.entries(theme.color)
      .filter(([key]) => key.startsWith('icon'))
      .map(([key, value]) => [key, value])
  );
  return (
    <Container width={800} style={{ gap: '8px' }}>
      {Object.keys(textColors).map(key => {
        return (
          <ColorWrapper
            key={key}
            color={textColors[key]}
            caption={key}
            icon={<ArticleIcon color={textColors[key]} />}
          />
        );
      })}
    </Container>
  );
};

Icon.parameters = getDesignLink('ColorsIcon');

export const Border = () => {
  const theme = useTheme();
  const textColors = Object.fromEntries(
    Object.entries(theme.color)
      .filter(([key]) => key.startsWith('border'))
      .map(([key, value]) => [key, value])
  );
  return (
    <Container width={700} style={{ gap: '8px' }}>
      {Object.keys(textColors).map(key => {
        return <ColorWrapper key={key} borderColor={textColors[key]} caption={key} />;
      })}
    </Container>
  );
};

Border.parameters = getDesignLink('ColorsBorder');
