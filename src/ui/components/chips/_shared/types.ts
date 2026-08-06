export type ChipSize = 'default' | 'small';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  background?: string;
  borderColor?: string;
  size?: ChipSize;
}

export interface ChipTruncatableProps extends ChipProps {
  maxWidth?: string | number;
}
