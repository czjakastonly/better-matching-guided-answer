type ForbiddenProps = 'type';

export interface ButtonAdditionalActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ForbiddenProps> {
  children?: React.ReactNode;
  iconOnly?: React.ReactNode;
  isLoading?: boolean;
  isPressed?: boolean;
  disabled?: boolean;
}
