import type { ReactNode, CSSProperties } from 'react';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'none';
  reverse?: boolean;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
  direction?: 'row' | 'column';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  /** number multiple 8 */
  gap?: string | number;
  margin?: string | number;
  marginX?: string | number;
  marginY?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  padding?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  position?: 'relative' | 'absolute';
}
