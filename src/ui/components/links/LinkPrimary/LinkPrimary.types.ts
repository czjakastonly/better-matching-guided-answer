export type LinkSize = 'small' | 'standard';

export interface LinkPrimaryProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  isLoading?: boolean;
  isPressed?: boolean;
  size?: LinkSize;
  disabled?: boolean;
}
