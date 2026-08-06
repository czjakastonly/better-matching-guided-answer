import React from 'react';
import { type LinkPrimaryProps } from '@ui/components/links/LinkPrimary/LinkPrimary.types';
import { LinkStyles } from '@ui/components/links/LinkPrimary/LinkPrimary.styles';
import { Loader } from '@ui/components/buttons/components/Loader';

export const LinkPrimary = React.forwardRef<HTMLAnchorElement, LinkPrimaryProps>(
  (
    {
      children,
      disabled,
      isLoading,
      isPressed,
      size = 'standard',
      href,
      target = '_blank',
      rel = 'noopener noreferrer',
      ...restHtmlLinkProps
    },
    forwardedRef
  ) => {
    const isDisabled = isLoading || disabled;

    return (
      <LinkStyles.LinkPrimary
        {...restHtmlLinkProps}
        href={href}
        target={target}
        ref={forwardedRef}
        disabled={isDisabled}
        isPressed={isPressed}
        $size={size}
        rel={rel}
      >
        {isLoading ? (
          <LinkStyles.IconWrap aria-hidden>
            <Loader isDark={false} />
          </LinkStyles.IconWrap>
        ) : (
          <LinkStyles.TextWrap>{children}</LinkStyles.TextWrap>
        )}
      </LinkStyles.LinkPrimary>
    );
  }
);
