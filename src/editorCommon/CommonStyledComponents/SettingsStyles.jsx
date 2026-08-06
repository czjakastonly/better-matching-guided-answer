import styled, { css } from 'styled-components';
import Button from '@editorCommon/StandardElements/Button';
import Loader from '@editorCommon/CustomElements/Loader';
import ChevronSVG from 'icons/chevronThinRight.svg';
import SearchSVG from 'icons/search.svg';
import CrossSVG from 'icons/crossSmall.svg';
import SearchEmptySVG from 'icons/searchGraphic.svg';
import { defaultScrollStyles } from '@editorCommon/CommonStyledComponents/CustomScrollbar';

export const wrapStyle = css`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;

  ${({ narrow }) =>
    narrow &&
    css`
      max-width: 640px;
    `}
`;

export const Title = styled.h2`
  ${wrapStyle};
  display: block;
  margin-top: 48px;
  margin-bottom: 24px;
  font-size: 32px;
  font-weight: 400;
  color: ${props => props.theme.color.textDark};
  flex-shrink: 0;
`;

export const TopTitle = styled(Title)`
  margin-top: 24px;
  font-size: 28px;
  line-height: 40px;
`;

export const Card = styled.div`
  ${wrapStyle};
  padding: 24px 32px;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 ${props => props.theme.canvasBox};

  ${({ paddingTop }) =>
    paddingTop &&
    css`
      padding-top: ${paddingTop}px;
    `}
`;

export const CardName = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.color.textDark};
  font-weight: 600;
`;

export const CardDescription = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.color.textSubtle};
  margin-top: 24px;

  var {
    color: ${props => props.theme.amaranth};
    background: ${props => props.theme.paleGrey};
    border: 1px solid ${props => props.theme.silver};
    border-radius: 2px;
    font-style: normal;
    padding: 1px 2px;
    font-family: monospace;
  }

  pre {
    display: block;
    padding: 12px 16px;
    margin-top: 12px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 18px;
    background-color: ${props => props.theme.paleGrey};
    color: ${props => props.theme.steel};
    margin-bottom: 32px;
    overflow: auto;
  }

  a {
    font-weight: 500;
    color: ${props => props.theme.linkColor};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SettingsWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  flex-grow: 1;
  overflow-y: auto;
  ${defaultScrollStyles};

  ${({ padded }) =>
    padded &&
    css`
      padding: 0 32px 32px;
    `}
`;

export const SettingsLeftPanel = styled.div`
  width: 296px;
  min-width: 296px;
  padding: 16px;
  border-right: 1px solid ${props => props.theme.color.borderSubtle};
  overflow-x: hidden;
  overflow-y: auto;
  ${defaultScrollStyles};
`;

export const SettingsLeftPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${props => props.theme.color.textSubtle};
  text-transform: uppercase;
  margin: 20px 8px 32px 8px;
`;

export const CardDivided = styled(Card)`
  display: flex;
  padding: 0;
  flex-shrink: 0;
  align-items: stretch;
  margin-bottom: 24px;
  min-width: 800px;
`;

export const CardDividedLeft = styled.div`
  padding: 16px;
  border-right: 1px solid ${props => props.theme.color.borderSubtle};
  width: 320px;
  flex-shrink: 0;
`;

export const CardDividedRight = styled.div`
  padding: 24px;
  min-width: 320px;
  flex-shrink: 1;
  flex-grow: 1;
`;

export const SectionHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 24px 24px 24px 32px;
  cursor: pointer;
  border-radius: 4px;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.borderFocus};
    outline-offset: 2px;
  }
`;

export const SectionIcon = styled.div`
  position: relative;
  line-height: 0;

  svg {
    width: 56px;
    height: 40px;

    path {
      fill: ${props => props.theme.color.iconDefaultWithText};
      transition: fill 0.2s;
    }
  }
`;

export const ExpandIcon = styled(ChevronSVG)`
  transition: transform 0.2s;
  margin-left: 24px;
`;

export const SectionTitle = styled.div`
  margin-left: 28px;
  margin-right: auto;
  display: flex;
  align-items: center;
  ${props => props.theme.typography.h3}
`;

export const SectionSubTitle = styled.div`
  margin-left: 28px;
  color: ${props => props.theme.color.textSubtle};
  ${props => props.theme.typography.uiElementSmall}
`;

export const SectionContent = styled.div`
  padding: 8px 64px 40px 116px;
  opacity: 0;
  transition: opacity 0.2s 0.1s;

  & > *:last-child {
    margin-bottom: 0;
  }

  ${({ wide }) =>
    wide &&
    css`
      padding-right: 24px;
    `}
`;

export const ContentPanel = styled.div`
  flex-grow: 1;
  min-width: 520px;
  min-height: 100%;
  position: relative;
`;

export const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  flex-grow: 1;
  overflow-y: auto;
  height: 100%;
  min-width: 520px;
  position: relative;
  ${defaultScrollStyles};

  ${({ withBottomPanel }) =>
    withBottomPanel &&
    css`
      margin-bottom: 88px;
      height: calc(100% - 88px);
    `}
`;

export const SectionsWrap = styled.div`
  padding: 0 32px;
  margin: 0 auto;
  width: 100%;
  max-width: 640px;
  font-weight: 400;
  color: ${props => props.theme.color.textDark};
  flex-grow: 1;
`;

export const Section = styled.div`
  max-height: 88px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.color.borderDefault};
  transition: border 0.2s, max-height 0.3s;
  overflow: hidden;
  width: 100%;

  &:last-child {
    margin-bottom: 304px;
  }

  ${({ active }) =>
    active &&
    css`
      border: 1px solid ${props => props.theme.color.borderActive};

      ${SectionIcon} svg path {
        fill: ${props => props.theme.color.iconActive};
      }
    `}

  ${({ expanded, maxHeight }) =>
    expanded &&
    css`
      overflow: visible;
      max-height: ${maxHeight}px;

      ${SectionContent} {
        opacity: 1;
      }

      ${ExpandIcon} {
        transform: rotate(90deg);
      }
    `}
`;

export const PaginationIndexes = styled.div`
  margin-left: auto;
  margin-right: 16px;
  padding-left: 16px;
  font-size: 12px;
  line-height: 20px;
  font-weight: 500;
  color: ${props => props.theme.color.textDefault};
`;

export const PaginationArrows = styled.div`
  margin-right: 24px;
  display: flex;
`;

export const ArrowButton = styled(Button)`
  display: block;

  &:first-child {
    margin-right: 12px;
  }
`;

export const SearchInputIcon = styled(SearchSVG)`
  margin-right: 12px;
  flex-shrink: 0;

  path {
    fill: ${props => props.theme.color.iconHover};
    transition: fill 0.2s;
  }
`;

export const SearchInput = styled.input`
  min-width: 0;
`;

export const SearchCrossIcon = styled(CrossSVG)`
  flex-shrink: 0;
  margin-left: 8px;
  cursor: pointer;
  display: none;

  path {
    fill: ${props => props.theme.color.iconDefault};
  }

  ${({ show }) =>
    show &&
    css`
      display: block;
    `}
`;

export const Search = styled.div`
  display: flex;
  align-items: center;
  width: 224px;
  height: 40px;
  border: 1px solid ${props => props.theme.color.borderDefault};
  border-radius: 4px;
  padding: 8px 12px;
  background: ${props => props.theme.color.backgroundDefault};

  input {
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    width: 100%;
    border: none;
    outline: none;
    padding: 0;
    color: ${props => props.theme.color.textDark};

    &:focus {
      & + svg path {
        fill: ${props => props.theme.color.iconHover};
      }
    }

    &::placeholder {
      color: ${props => props.theme.color.textPlaceholder};
      opacity: 1;
    }
  }
`;

export const SearchEmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
`;

export const EmptyListWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
`;

export const SearchEmptyIcon = styled(SearchEmptySVG)`
  width: 72px;
  height: 72px;
`;

export const SearchEmptyText = styled.div`
  width: 240px;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: ${props => props.theme.color.textSubtle};
`;

export const EmptyListText = styled.p`
  font-size: 14px;
  line-height: 18px;
  margin: 10px 0 32px;
  text-align: center;
  color: ${props => props.theme.color.textSubtle};
`;

export const StyledLoader = styled(Loader)`
  margin: 86px 0;
`;

export const DocsTitle = styled(Title)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
