import React, { Component } from 'react';
import isEqual from 'react-fast-compare';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { blendColors } from 'helpers/colorHelpers';
import Icon from '@editorCommon/StandardElements/Icon/Icon.jsx';
import Tooltip from '@editorCommon/CustomElements/Tooltip/Tooltip.jsx';
import ActionList from '@editorCommon/CustomElements/ActionList';
import Dropdown from '@editorCommon/CustomElements/Dropdown';
import Loader from '@editorCommon/CustomElements/Loader/Loader';
import ArrowRightSVG from 'icons/arrowRight.svg';
import ChevronRightSVG from 'icons/chevronRight.svg';
import SelectDownSVG from 'icons/selectDown.svg';
import MoreSVG from 'icons/more.svg';

const Canvas = styled.div`
  display: inline-block;
  position: relative;
`;

const ArrowRightIcon = styled(ArrowRightSVG)`
  width: 24px;
  height: 24px;
  margin-left: 8px;
  margin-right: -32px;
  opacity: 0;
  visibility: hidden;
  transform: translate3d(-4px, 0, 0);
  transition: opacity 0.2s, visibility 0.2s, margin-right 0.3s, transform 0.4s;

  /* @noflip */
  [dir='rtl'] & {
    transform: translate3d(4px, 0, 0) scaleX(-1);
  }
`;

const StyledDropdown = styled(Dropdown)`
  white-space: nowrap;
`;

const ChevronRightIcon = styled(ChevronRightSVG)`
  width: 16px;
  height: 16px;
  margin-left: 12px;
  margin-right: -24px;
  opacity: 0;
  visibility: hidden;
  transform: translate3d(-4px, 0, 0) rotate(0);
  transition: opacity 0.2s, visibility 0.2s, margin-right 0.2s, transform 0.2s;

  /* @noflip */
  [dir='rtl'] & {
    transform: translate3d(-4px, 0, 0) rotate(0) scaleX(-1);
  }
`;

const PickerDownIcon = styled(SelectDownSVG)`
  width: 16px;
  height: 16px;

  path {
    fill: white;
  }
`;

const PickerChevronIcon = styled(ChevronRightSVG)`
  width: 16px;
  height: 16px;

  path {
    fill: white;
  }
`;

const PickerMoreIcon = styled(MoreSVG)`
  width: 16px;
  height: 16px;

  path {
    fill: white;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  text-decoration: none;

  a {
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  button {
    -webkit-tap-highlight-color: transparent;
    font-family: -apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Helvetica Neue, sans-serif;

    ${({ added, removed, modified }) => {
      if (removed) {
        return css`
          background-color: ${props => props.theme.changesRemovedColor};
          border-color: transparent;
          color: ${props => props.theme.amaranth};
          opacity: 1 !important;
        `;
      }
      if (added) {
        return css`
          background-color: ${props => props.theme.changesAddedColor};
          border-color: transparent;
          color: ${props => props.theme.seaweed};
          opacity: 1 !important;
        `;
      }
      if (modified) {
        return css`
          background-color: ${props => props.theme.changesModifiedColor};
          border-color: transparent;
          color: ${props => props.theme.mango};
          opacity: 1 !important;
        `;
      }
    }}
  }
`;

const StyledButtonInterior = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.button`
  color: ${props => props.theme.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 7px;

  @media (hover: hover) and (pointer: fine) {
    ${({ disabled, arrowType }) =>
      !disabled &&
      css`
        &:hover,
        &:focus {
          ${arrowType === 'chevron' &&
          css`
            ${ChevronRightIcon} {
              opacity: 1;
              visibility: visible;
              margin-right: -12px;
              transform: translate3d(0, 0, 0) rotate(90deg);

              /* @noflip */
              [dir='rtl'] & {
                transform: translate3d(0, 0, 0) rotate(90deg) scaleX(-1);
              }
            }
          `}

          ${(arrowType === 'arrow' || arrowType === 'more') &&
          css`
            ${ArrowRightIcon} {
              opacity: 1;
              visibility: visible;
              margin-right: -12px;
              transform: translate3d(0, 0, 0);

              /* @noflip */
              [dir='rtl'] & {
                transform: translate3d(0, 0, 0) scaleX(-1);
              }
            }
          `}
        }
      `}
  }

  body.navigating-with-keyboard &:focus {
    box-shadow: 0 0 0 2px white, 0 0 0 4px ${props => props.theme.darkBlue};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `}

  ${({ background, disabled, theme }) =>
    background === 'white' &&
    css`
      color: ${theme.slateGrey};
      background: ${theme.white};
      border: 1px solid #d6d6d6;

      &:hover,
      &:active {
        background: ${theme.white};
        color: ${blendColors('#000000', theme.white, 0.2)};
      }

      &:disabled {
        color: ${blendColors('#000000', theme.white, 0.5)};
      }

      ${disabled &&
      css`
        & svg path {
          fill: ${blendColors(theme.slateGrey, theme.white, 0.5)};
        }
      `}

      & svg path {
        fill: ${theme.slateGrey};
      }

      & svg g {
        fill: ${theme.slateGrey};
      }
    `}

  ${({ background, disabled, theme }) =>
    background === 'highlight' &&
    css`
      color: ${theme.white};
      background: ${theme.backgroundPrimary};
      border: 1px solid ${theme.backgroundPrimary};

      ${!disabled &&
      css`
        &:hover,
        &:active {
          background: ${blendColors(theme.backgroundPrimary, theme.white, 0.125)};

          color: ${theme.white};
        }
      `}

      &:disabled {
        opacity: 0.5;
      }

      & svg path {
        fill: ${theme.white};
      }
    `}

    ${({ background, disabled, theme }) =>
    background === 'outlineAmaranth' &&
    css`
      color: ${theme.highlightColor};
      background: transparent;
      border: 1px solid ${theme.highlightColor};

      &:disabled {
        opacity: 0.5;
      }

      ${disabled &&
      css`
        & svg path {
          fill: ${blendColors(theme.highlightColor, theme.white, 0.5)};
        }
      `}

      & svg path {
        fill: ${theme.highlightColor};
      }

      & svg g {
        fill: ${theme.highlightColor};
      }
    `}

  ${({ background, theme }) =>
    background === 'main' &&
    css`
      color: ${theme.white};
      background: ${theme.mainColor};

      &:hover,
      &:active {
        background: ${blendColors(theme.mainColor, theme.white, 0.125)};
      }

      &:disabled {
        background: ${blendColors(theme.mainColor, theme.white, 0.5)};
      }
    `}

  ${({ background, theme }) =>
    background === 'secondary' &&
    css`
      border: 0;
      color: ${theme.white};
      background: ${theme.secondaryColor};

      &:hover,
      &:active {
        background: ${blendColors(theme.secondaryColor, theme.white, 0.125)};
      }

      &:disabled {
        background: ${blendColors(theme.secondaryColor, theme.white, 0.5)};
      }
    `}

  ${({ background, selected, theme }) =>
    background === 'transparentGreyBorder' &&
    css`
      border: 0;
      color: ${theme.white};
      background: ${selected ? 'rgba(211, 213, 218, 0.15)' : 'none'};
      border: 1px solid ${theme.grey};

      &:hover,
      &:active {
        background: ${selected ? 'rgba(211, 213, 218, 0.15)' : 'rgba(211, 213, 218, 0.1)'};
      }

      &:disabled {
        background: rgba(211, 213, 218, 0.1);
        opacity: 0.3;
      }
    `}

  ${({ background, selected, theme }) =>
    background === 'filledGreyBorder' &&
    css`
      border: 0;
      color: ${theme.slateGrey};
      background: ${selected ? 'rgba(211, 213, 218, 0.15)' : 'none'};
      border: 1px solid ${theme.grey};

      &:hover,
      &:active {
        background: ${selected ? 'rgba(211, 213, 218, 0.15)' : 'rgba(211, 213, 218, 0.1)'};
      }

      &:disabled {
        background: rgba(211, 213, 218, 0.1);
        opacity: 0.3;
      }
    `}

  ${({ background, selected, theme }) =>
    background === 'outlineWhite' &&
    css`
      border: 0;
      color: ${theme.white};
      background: ${selected ? 'rgba(211, 213, 218, 0.15)' : 'none'};
      border: 1px solid ${theme.white};

      &:hover,
      &:active {
        background: ${selected ? 'rgba(211, 213, 218, 0.15)' : 'rgba(211, 213, 218, 0.1)'};
      }

      &:disabled {
        background: rgba(211, 213, 218, 0.1);
        opacity: 0.3;
      }
    `}


  ${({ background, theme }) =>
    background === 'dark' &&
    css`
      border: 0;
      color: ${theme.white};
      background: ${props => props.theme.navy};

      &:hover,
      &:active {
        background: #353065;
      }

      &:disabled {
        background: rgba(211, 213, 218, 0.1);
        opacity: 0.3;
      }
    `}


  ${({ background, selected }) =>
    background === 'transparent' &&
    css`
      color: rgba(255, 255, 255, 0.9);
      background: ${selected ? 'rgba(255, 255, 255, 0.15)' : 'none'};
      border: 1px solid rgba(255, 255, 255, 0.25);

      &:hover,
      &:active {
        background: ${selected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'};
      }

      &:disabled {
        background: rgba(255, 255, 255, 0.1);
      }

      body.navigating-with-keyboard &:focus {
        box-shadow: 0 0 0 2px ${props => props.theme.inkBlue}, 0 0 0 4px ${props => props.theme.darkBlue};
      }
    `}


  ${({ canvas, background, disabled, theme }) =>
    canvas === 'icon' &&
    css`
      height: ${theme.buttonIconHeight};
      width: ${theme.buttonIconWidth};

      & svg {
        width: ${theme.buttonIconIconSize};
        height: ${theme.buttonIconIconSize};
      }

      & svg path {
        transition: fill 0.2s;

        fill: ${background === 'transparent' ? 'rgba(255, 255, 255, 0.8)' : ''};
      }

      ${disabled &&
      css`
        opacity: 0.3;
      `}
    `}

  ${({ canvas, background }) =>
    canvas === 'custom' &&
    css`
      height: 36px;
      width: auto;

      & svg {
        width: 16px;
        height: 16px;
      }

      & svg path {
        transition: fill 0.2s;

        fill: ${background === 'transparent' ? 'rgba(255, 255, 255, 0.8)' : ''};
      }
    `}

  ${({ canvas }) =>
    canvas === 'plain' &&
    css`
      appearance: none;
      border: 0;
      height: auto;
      width: auto;
      padding: 0;
    `}

  ${({ canvas, theme }) =>
    canvas === 'squareIcon' &&
    css`
      height: ${theme.buttonIconHeight};
      width: ${theme.buttonIconWidth};
      border-radius: 4px !important;
      border: 1px solid transparent;

      &:hover {
        border-color: ${props => props.theme.grey};
      }

      & svg {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 16px;
        height: 16px;
      }
    `}

  ${({ canvas, background, theme }) =>
    canvas === 'smallIcon' &&
    css`
      height: ${theme.buttonSmallIconHeight};
      width: ${theme.buttonSmallIconWidth};
      position: relative;

      &:disabled {
        & svg path {
          fill: ${props => props.theme.grey};
        }
      }

      & svg {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
      }

      & svg path {
        transition: fill 0.2s;
        fill: ${background === 'transparent' ? 'rgba(255, 255, 255, 0.8)' : ''};
      }
    `}

  ${({ canvas, theme }) =>
    canvas === 'text' &&
    css`
      height: ${theme.buttonTextHeight};
      padding: 0 ${theme.buttonTextVerticalPadding};
      font-size: ${theme.buttonTextFontSize};
    `}

  ${({ canvas, theme }) =>
    canvas === 'bigText' &&
    css`
      height: ${theme.buttonBigTextHeight};
      padding: 0 ${theme.buttonBigTextVerticalPadding};
      font-size: ${theme.buttonBigTextFontSize};
    `}


  ${({ picker }) =>
    picker
      ? css`
          border-radius: 32px 0 0 32px;
          border-right: 0;
        `
      : css`
          border-radius: 32px;
        `}

  transition: background-color 0.2s, color 0.2s, width 0.2s, height 0.2s, padding 0.2s, margin 0.2s, border 0.2s, opacity 0.2s, visibility 0.2s;
  cursor: pointer;
  outline: none;
  font-weight: 600;
  user-select: none;
  text-transform: uppercase;

  ${({ mouseover, theme, disabled }) =>
    !disabled &&
    mouseover === 'normal' &&
    css`
      &:hover,
      &:active {
        border-color: ${theme.secondaryColor};
      }
      &:hover svg path,
      &:active svg path {
        fill: ${theme.secondaryColor};
      }
    `}

  ${({ mouseover, theme, disabled }) =>
    !disabled &&
    mouseover === 'highlight' &&
    css`
      &:hover,
      &:active {
        background: ${theme.highlightColor};
        border: 1px solid ${theme.highlightColor};
        color: ${theme.white};
      }
      &:hover svg path,
      &:active svg path {
        fill: ${theme.white};
      }
    `}

  ${({ mouseover, theme, disabled }) =>
    !disabled &&
    mouseover === 'grey' &&
    css`
      &:hover,
      &:active {
        background: ${theme.paleGrey};
      }
      &:hover svg path,
      &:active svg path {
        fill: ${theme.darkGrey};
      }
    `}

  ${({ mouseover, disabled }) =>
    !disabled &&
    mouseover === 'negative' &&
    css`
      &:hover,
      &:active {
        border-color: #b70004;
      }
      &:hover svg path,
      &:active svg path {
        fill: #b70004;
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: auto;
    `}
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
  ${({ minWidth }) =>
    minWidth &&
    css`
      min-width: ${minWidth}px;
    `}
`;

const Picker = styled(StyledButton)`
  border-radius: 0 32px 32px 0;
  border-left: 1px solid rgba(24, 36, 73, 0.25);
  padding-top: 18px;
  padding: 0 12px;
  margin: 0;
`;

const ButtonEmpty = styled.div`
  border-radius: 32px;
  line-height: 0;
`;

const StyledLink = styled(Link)`
  width: 100%;
  cursor: inherit;
  outline: none;
`;

const StyledAnchorLink = styled.a`
  width: 100%;
`;

class Button extends Component {
  state = {
    isDropdownOpen: false,
    tooltipToDisplay: '',
  };

  dropdownRef = React.createRef();

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props, nextProps) || !isEqual(nextState, this.state)) {
      return true;
    }
    return false;
  }

  closeDropdown = () => {
    this.dropdownRef.current.closeDropdown();
  };

  render() {
    const {
      className,
      onClick = () => {},
      link = '',
      external = false,
      newTab = false,
      mouseover,
      content,
      type = 'text',
      selected,
      usage,
      background = 'highlight',
      fullWidth,
      minWidth,
      disabled = false,
      form = '',
      tooltip = '',
      positionTooltip = 'up',
      forceTooltip = false,
      picker = false,
      pickerDisabled = false,
      pickerOptions,
      added,
      removed,
      modified,
      ariaLabel = '',
      withArrow,
      arrowType = 'arrow',
      dataCy,
      dataStaticValue,
      isLoading,
    } = this.props;

    const { tooltipToDisplay } = this.state;

    const displayTooltip = forceTooltip || (tooltip !== '' && !disabled);
    const show = displayTooltip && tooltipToDisplay === tooltip;

    const onmouseoverAction = displayTooltip ? () => this.setState({ tooltipToDisplay: tooltip }) : null;
    const onmouseoutAction = displayTooltip ? () => this.setState({ tooltipToDisplay: '' }) : null;

    const onClickProxy = e => {
      onClick(e);
      if (onmouseoutAction) {
        onmouseoutAction();
      }
    };

    const PropIcon = content;

    let contentToDisplay =
      type === 'text' || type === 'bigText' ? (
        content
      ) : (
        <ButtonEmpty>
          {typeof content !== 'function' && typeof content !== 'object' ? (
            <Icon cacheGetRequests src={`/${content}`} />
          ) : (
            <PropIcon />
          )}
        </ButtonEmpty>
      );

    contentToDisplay = (
      <StyledButton
        type={usage}
        canvas={type}
        mouseover={mouseover}
        background={background}
        selected={selected}
        onClick={onClickProxy}
        tabIndex={0}
        disabled={disabled}
        fullWidth={fullWidth}
        form={form}
        picker={picker}
        minWidth={minWidth}
        arrowType={arrowType}
        value="submit"
        aria-label={
          ariaLabel ||
          (type === 'text' || type === 'bigText' ? content : `icon ${typeof content === 'string' ? content : ''}`)
        }
        data-cy={dataCy}
        data-static-value={dataStaticValue}
      >
        <StyledButtonInterior>
          {isLoading ? (
            <Loader type="dots" />
          ) : (
            <>
              {contentToDisplay}
              {withArrow && (
                <>
                  {arrowType === 'arrow' && <ArrowRightIcon />}
                  {arrowType === 'chevron' && <ChevronRightIcon />}
                  {arrowType === 'more' && <MoreSVG />}
                </>
              )}
            </>
          )}
        </StyledButtonInterior>
      </StyledButton>
    );

    return (
      <Canvas className={className}>
        <ButtonWrapper
          added={added}
          removed={removed}
          modified={modified}
          onMouseEnter={onmouseoverAction}
          onMouseLeave={onmouseoutAction}
        >
          {link && !external && (
            <StyledLink to={link} tabIndex="-1" target={newTab ? '_blank' : ''}>
              {contentToDisplay}
            </StyledLink>
          )}
          {link && external && (
            <StyledAnchorLink href={link} target={newTab ? '_blank' : ''} rel={newTab ? 'noopener' : ''}>
              {contentToDisplay}
            </StyledAnchorLink>
          )}
          {!link && contentToDisplay}
          {picker && (
            <StyledDropdown
              ref={this.dropdownRef}
              offsetValue={16}
              disabled={pickerDisabled == null ? disabled : pickerDisabled}
              trigger={
                <Picker
                  type={usage}
                  canvas={type}
                  mouseover={mouseover}
                  background={background}
                  data-static-value={dataStaticValue ? `${dataStaticValue}-picker` : undefined}
                  data-cy={dataCy ? `${dataCy}-picker` : undefined}
                  disabled={pickerDisabled == null ? disabled : pickerDisabled}
                >
                  {arrowType === 'arrow' && <PickerDownIcon />}
                  {arrowType === 'chevron' && <PickerChevronIcon />}
                  {arrowType === 'more' && <PickerMoreIcon />}
                </Picker>
              }
            >
              {pickerOptions && (
                <ActionList data-cy="dropdownWithActions" options={pickerOptions} onPostSelect={this.closeDropdown} />
              )}
            </StyledDropdown>
          )}
        </ButtonWrapper>
        {displayTooltip && <Tooltip position={positionTooltip} show={show} content={tooltip} />}
      </Canvas>
    );
  }
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  mouseover: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element, PropTypes.object]),
  type: PropTypes.string,
  background: PropTypes.string,
  usage: PropTypes.string,
  disabled: PropTypes.bool,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  external: PropTypes.bool,
  form: PropTypes.string,
  tooltipToDisplay: PropTypes.string,
  tooltip: PropTypes.string,
  positionTooltip: PropTypes.string,
  toggleComponent: PropTypes.func,
  fullWidth: PropTypes.bool,
  forceTooltip: PropTypes.bool,
  selected: PropTypes.bool,
  newTab: PropTypes.bool,
  minWidth: PropTypes.number,
  picker: PropTypes.bool,
  pickerDisabled: PropTypes.bool,
  pickerOptions: PropTypes.array,
  added: PropTypes.bool,
  removed: PropTypes.bool,
  modified: PropTypes.bool,
  ariaLabel: PropTypes.string,
  withArrow: PropTypes.bool,
  arrowType: PropTypes.string,
  dataCy: PropTypes.string,
  dataStaticValue: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default Button;
