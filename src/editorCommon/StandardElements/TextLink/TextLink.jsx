import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { withRouter, Link } from 'react-router-dom';

const Canvas = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  ${({ type, selected, theme }) =>
    type === 'darkBg' &&
    css`
      color: ${theme.white};
      opacity: ${selected ? '1' : '0.7'};

      @media not all and (pointer: coarse), (min--moz-device-pixel-ratio: 0) {
        &:hover {
          opacity: 1;
        }
      }
    `}

  ${({ type, selected }) =>
    type === 'white' &&
    css`
      position: relative;
      color: ${props => props.theme.darkGrey};
      opacity: ${selected ? '1' : '0.7'};
      transition: color 0.2s, opacity 0.2s;

      @media not all and (pointer: coarse), (min--moz-device-pixel-ratio: 0) {
        &:hover {
          opacity: 1;
        }
      }

      &:after {
        display: block;
        position: absolute;
        content: '';
        height: 2px;
        width: 100%;
        background: ${props => props.theme.seaweed};
        bottom: -6px;
        left: -5px;
        width: calc(100% + 10px);
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }

      ${selected &&
      css`
        &:after {
          opacity: 1;
        }
      `}
    `}

  ${({ type, selected, theme }) =>
    type === 'transparent' &&
    css`
      position: relative;
      color: ${theme.white};
      opacity: ${selected ? '1' : '0.7'};
      transition: color 0.2s, opacity 0.2s;

      @media not all and (pointer: coarse), (min--moz-device-pixel-ratio: 0) {
        &:hover {
          opacity: 1;
        }
      }

      &:after {
        display: block;
        position: absolute;
        content: '';
        height: 2px;
        width: 100%;
        background: ${props => props.theme.seaweed};
        bottom: -6px;
        left: -5px;
        width: calc(100% + 10px);
        opacity: 0;
        transition: opacity 0.2s;
      }

      ${selected &&
      css`
        &:after {
          opacity: 1;
        }
      `}
    `}

  ${({ type, selected, theme }) =>
    type &&
    type.includes('black') &&
    css`
      color: ${props => props.theme.darkGrey};
      font-weight: ${selected ? '600' : 'normal'};

      & svg path {
        fill: ${type === 'black' ? theme.lightGrey : theme.darkGrey};
      }

      ${selected &&
      css`
        font-weight: 600;
      `}
    `}

  ${({ type, selected }) =>
    type === 'slateGrey' &&
    css`
      color: ${props => props.theme.slateGrey};

      & svg path {
        fill: ${props => props.theme.slateGrey};
      }

      ${selected &&
      css`
        font-weight: 500;
        color: ${props => props.theme.darkGrey};
      `}
    `}

  ${({ type }) =>
    type === 'negative' &&
    css`
      color: #d0021b;

      & svg path {
        fill: ${props => props.theme.lightGrey};
      }
    `}

  ${({ type, selected }) =>
    type === 'grey' &&
    css`
      color: ${props => props.theme.slateGrey};

      @media not all and (pointer: coarse), (min--moz-device-pixel-ratio: 0) {
        &:hover {
          color: ${props => props.theme.darkGrey};
        }
      }

      ${selected &&
      `
      color: ${props => props.theme.darkGrey};
      `}
    `}

  ${({ type, theme, selected }) =>
    type === 'main' &&
    css`
      color: ${selected ? theme.secondaryColor : theme.darkGrey};
      font-weight: ${selected ? '600' : 'normal'};

      @media not all and (pointer: coarse), (min--moz-device-pixel-ratio: 0) {
        &:hover {
          color: ${theme.secondaryColor};
        }
      }
    `}

  ${({ type, theme }) =>
    type === 'highlight' &&
    css`
      color: ${theme.highlightColor};
    `}

  ${({ type, theme }) =>
    type === 'lowlight' &&
    css`
      color: ${theme.secondaryColor};
    `}

  ${({ type, theme }) =>
    type === 'light' &&
    css`
      color: ${theme.slateGrey};
    `}
  ${({ type }) =>
    type === 'selected' &&
    css`
      color: '#333333';
    `}

  @media not all and (pointer: coarse), (min--moz-device-pixel-ratio:0) {
    &:hover svg path {
      ${({ bullet, theme, bulletHover }) => bullet && bulletHover === 'fill' && `fill: ${theme.secondaryColor}`}
      ${({ bullet, theme, bulletHover }) => bullet && bulletHover === 'stroke' && `stroke: ${theme.secondaryColor}`}
    }
  }

  text-decoration: ${({ type }) => (type === 'selected' ? 'underline' : 'none')};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const WrapSVG = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

const FinalLink = styled.div`
  width: 100%;
  color: inherit;
  ${({ ellipsis }) =>
    ellipsis &&
    css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}
`;

const TextLink = ({
  children,
  className,
  type,
  selected,
  href,
  absolute = false,
  newWindow = false,
  onClick,
  bullet = '',
  bulletHover = 'fill',
  ellipsis = false,
  title = '',
  dataCy,
  dataStonlyTrigger,
}) => {
  const Bullet = bullet;
  return (
    <Canvas className={className} type={type} selected={selected} bullet={bullet} bulletHover={bulletHover} first>
      {href && (absolute || newWindow) && (
        <>
          {bullet && (
            <WrapSVG>
              <Bullet />
            </WrapSVG>
          )}
          <FinalLink
            as="a"
            onClick={onClick}
            ellipsis={ellipsis}
            href={href}
            target={newWindow ? '_blank' : ''}
            data-cy={dataCy}
            data-stonly-trigger={dataStonlyTrigger}
          >
            {children}
          </FinalLink>
        </>
      )}
      {href && !absolute && !newWindow && (
        <>
          {bullet && (
            <WrapSVG>
              <Bullet />
            </WrapSVG>
          )}
          <Link data-cy={dataCy} data-stonly-trigger={dataStonlyTrigger} onClick={onClick} to={href}>
            {children}
          </Link>
        </>
      )}

      {!href && (
        <>
          {bullet && (
            <WrapSVG onClick={onClick}>
              <Bullet />
            </WrapSVG>
          )}
          <FinalLink
            role="link"
            ellipsis={ellipsis}
            title={title}
            onClick={onClick}
            onKeyDown={onClick}
            data-cy={dataCy}
            data-stonly-trigger={dataStonlyTrigger}
          >
            {children}
          </FinalLink>
        </>
      )}
    </Canvas>
  );
};

TextLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
  background: PropTypes.string,
  selected: PropTypes.bool,
  type: PropTypes.string,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  bullet: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  absolute: PropTypes.bool,
  newWindow: PropTypes.bool,
  bulletHover: PropTypes.string,
  ellipsis: PropTypes.bool,
  title: PropTypes.string,
  history: PropTypes.object,
  dataCy: PropTypes.string,
  dataStonlyTrigger: PropTypes.string,
};

export default withRouter(TextLink);
