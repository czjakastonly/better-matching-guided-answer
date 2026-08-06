import styled from 'styled-components';

export const Canvas = styled.div<{
  $display: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'none';
  $alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  $justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  $direction?: 'row' | 'column';
  $flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  $flexGrow?: number;
  $flexShrink?: number;
  $flexBasis?: string | number;
  $gap?: string | number;
  $reverse?: boolean;
  $margin?: string | number;
  $padding?: string | number;
  $position?: string;
}>`
  display: ${({ $display }) => $display};
  min-height: 0;
  min-width: 0;
  align-items: ${({ $alignItems }) => $alignItems};
  justify-content: ${({ $justifyContent }) => $justifyContent};
  flex-direction: ${({ $direction, $reverse }) => $direction && `${$direction}${$reverse ? '-reverse' : ''}`};
  flex-grow: ${({ $flexGrow }) => $flexGrow};
  flex-shrink: ${({ $flexShrink }) => $flexShrink};
  flex-basis: ${({ $flexBasis }) => $flexBasis};
  flex-wrap: ${({ $flexWrap }) => $flexWrap};

  gap: ${({ $gap }) => $gap};
  margin: ${({ $margin }) => $margin};
  padding: ${({ $padding }) => $padding};
  position: ${({ $position }) => $position};
`;
