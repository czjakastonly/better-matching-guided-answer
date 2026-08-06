import React from 'react';
import { useTheme } from 'styled-components';
import { ListItemStyles } from './_shared/styles';

export interface ListItemStandardProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: React.ReactNode;
  badgeColor?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  iconContentType?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  isHighlighted?: boolean;
  isSelected?: boolean;
  label?: React.ReactNode;
  isNavigationItem?: boolean;
}

export const ListItemStandard = React.forwardRef<HTMLDivElement, ListItemStandardProps>(
  (
    {
      badge,
      badgeColor,
      description,
      disabled,
      iconContentType,
      iconLeft,
      iconRight,
      iconTrailing,
      isHighlighted,
      isSelected,
      label,
      isNavigationItem,
      ...restDivAttributes
    },
    forwardedRef
  ) => {
    const theme = useTheme();
    const badgeBackgroundColor = badgeColor || theme.color.backgroundGrayDefault;

    return (
      <ListItemStyles.ContainerSelectable
        {...restDivAttributes}
        isDisabled={disabled}
        isHighlighted={isHighlighted}
        isSelected={isSelected}
        // Why not added automatically those props:
        // aria-selected={isSelected}
        // aria-disabled={disabled}
        // Because on multiselect we use aria-selected="false"; on single select it's just not set if false
        ref={forwardedRef}
      >
        {iconLeft && <ListItemStyles.LeftIconContainer aria-hidden>{iconLeft}</ListItemStyles.LeftIconContainer>}
        <ListItemStyles.TextContainer>
          <ListItemStyles.TitleContainer>
            <ListItemStyles.Title>{label}</ListItemStyles.Title>
            {badge && (
              <ListItemStyles.Badge aria-hidden style={{ backgroundColor: badgeBackgroundColor }}>
                {badge}
              </ListItemStyles.Badge>
            )}
            {iconTrailing && (
              <ListItemStyles.TrailingIconContainer aria-hidden>{iconTrailing}</ListItemStyles.TrailingIconContainer>
            )}
          </ListItemStyles.TitleContainer>
          <ListItemStyles.DescriptionContainer>
            {iconContentType && (
              <ListItemStyles.ContentTypeIconContainer aria-hidden>
                {iconContentType}
              </ListItemStyles.ContentTypeIconContainer>
            )}
            {description && <ListItemStyles.Description>{description}</ListItemStyles.Description>}
          </ListItemStyles.DescriptionContainer>
        </ListItemStyles.TextContainer>
        {isNavigationItem && <ListItemStyles.ChevronRightIcon aria-hidden />}
        {iconRight && <ListItemStyles.RightIconContainer aria-hidden>{iconRight}</ListItemStyles.RightIconContainer>}
        {isSelected && <ListItemStyles.TickIcon aria-hidden />}
      </ListItemStyles.ContainerSelectable>
    );
  }
);
