import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CrossSVG from 'icons/cross.svg';

const sizeMap = {
  widthHeight: {
    verysmall: 16,
    small: 20,
    big: 36,
  },
  borderRadius: {
    verysmall: 100,
    small: 100,
    big: 31,
  },
};

const colorMap = {
  normal: {
    light: css`
      ${props => props.theme.steel};
    `,
    dark: '#929397',
    veryDark: '#262144',
  },
  hover: {
    light: '#8b8e95cc',
    dark: '#A7A9AF',
    veryDark: css`
      ${props => props.theme.inkBlue};
    `,
  },
};

const ButtonStyle = css`
  position: absolute;
  width: ${({ size }) => sizeMap.widthHeight[size]}px;
  height: ${({ size }) => sizeMap.widthHeight[size]}px;
  border-radius: ${({ size }) => sizeMap.borderRadius[size]}px;
  top: ${({ placement }) => placement}px;
  ${({ position }) => position}: ${({ placement }) => placement}px;
  transition: box-shadow 0.2s;
  outline: none;

  &:focus {
    outline: none;
  }
  body.navigating-with-keyboard &:focus {
    box-shadow: 0px 0px 0px 2px white, 0px 0px 0px 4px ${props => props.theme.darkBlue};
  }
`;

const Canvas = styled.div``;
const Close = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: ${({ variant }) => colorMap.normal[variant]};
  cursor: pointer;
  transition: background-color 0.2s;

  @media not all and (pointer: coarse) {
    &:hover {
      background-color: ${({ variant }) => colorMap.hover[variant]};
    }
  }
`;

const CloseLink = styled(Link)`
  ${ButtonStyle}
`;

const CloseFunction = styled.div`
  ${ButtonStyle}
`;

const Cross = styled(CrossSVG)`
  pointer-events: none;
  width: 20px;
  height: 20px;

  ${({ size }) =>
    size === 'verysmall' &&
    css`
      width: ${sizeMap.widthHeight[size]}px;
      height: ${sizeMap.widthHeight[size]}px;
    `}

  path {
    ${({ variant }) =>
      variant === 'dark' &&
      css`
        fill: ${props => props.theme.darkGrey};
      `}
  }
`;

const CloseButton = ({
  onClick,
  href,
  size = 'small',
  variant = 'light',
  placement = 24,
  position = 'right',
  className,
  dataCy,
}) => {
  const { t } = useTranslation();
  const onClickProxy = e => {
    if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <Canvas className={className} data-cy={dataCy}>
      {href && (
        <CloseLink
          to={href}
          size={size}
          variant={variant}
          placement={placement}
          position={position}
          role="button"
          tabIndex="0"
          aria-label={t('Global.Close')}
        >
          <Close size={size} variant={variant}>
            <Cross size={size} variant={variant} />
          </Close>
        </CloseLink>
      )}

      {onClick && (
        <CloseFunction
          onClick={onClick}
          onKeyDown={onClickProxy}
          size={size}
          variant={variant}
          placement={placement}
          position={position}
          role="button"
          aria-label={t('Global.Close')}
          tabIndex="0"
          data-cy={dataCy ? `${dataCy}-function` : undefined}
        >
          <Close size={size} variant={variant} data-cy={dataCy ? `${dataCy}-close` : undefined}>
            <Cross size={size} variant={variant} />
          </Close>
        </CloseFunction>
      )}
    </Canvas>
  );
};

CloseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  placement: PropTypes.number,
  position: PropTypes.string,
  dataCy: PropTypes.string,
};

export default CloseButton;
