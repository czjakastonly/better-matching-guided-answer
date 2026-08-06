type ForbiddenProps = 'className' | 'type' | 'tabindex';

export interface ButtonSplitProps extends Omit<React.ButtonHTMLAttributes<HTMLDivElement>, ForbiddenProps> {
  children?: React.ReactNode;
}
