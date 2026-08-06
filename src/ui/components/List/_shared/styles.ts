import styled, { css } from 'styled-components';
import TickSVG from '@ui/atoms/icons/Tick-16.svg';
import ChevronRightSVG from '@ui/atoms/icons/ChevronRight-16.svg';
import ChevronLeftSVG from '@ui/atoms/icons/ChevronLeft-16.svg';

export const focusListItemOutlineStyle = css`
  outline: 2px solid ${({ theme }) => theme.color.borderFocus};
  outline-offset: -1px;
`;

const TextContainer = styled.div`
  width: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
`;

const DescriptionContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Badge = styled.div`
  ${props => props.theme.typography.uiElementSmallStrong};
  color: ${props => props.theme.color.textDefaultInverse};
  padding: 0 4px;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const Title = styled.div`
  color: ${props => props.theme.color.textDefault};
  ${props => props.theme.typography.uiElementStrong};
`;

const Description = styled.div`
  color: ${props => props.theme.color.textSubtle};
  ${props => props.theme.typography.uiElementSmall};
`;

const TickIcon = styled(TickSVG)`
  margin-left: 12px;
  margin-top: 2px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  path {
    fill: ${props => props.theme.color.iconSuccess};
  }
`;

const ChevronRightIcon = styled(ChevronRightSVG)`
  flex-shrink: 0;
  margin: auto 0;
  margin-left: 12px;
`;

const ChevronLeftIcon = styled(ChevronLeftSVG)`
  path {
    color: ${({ theme }) => theme.color.iconDefaultWithText};
  }
`;

const IconContainer = styled.div`
  width: 16px;
  height: 16px;
  margin-top: 2px;
  flex-shrink: 0;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;

const LeftIconContainer = styled(IconContainer)`
  margin-right: 8px;
`;

const TrailingIconContainer = styled(IconContainer)`
  margin-left: 8px;
`;

const RightIconContainer = styled(IconContainer)`
  margin-left: 12px;
`;

const ContentTypeIconContainer = styled(IconContainer)`
  margin-top: 0;
  margin-right: 4px;
  width: 12px;
  height: 20px;
`;

const Container = styled.div`
  display: flex;
  padding: 8px 16px 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
  cursor: pointer;
  scroll-margin: 50px;
`;

const ContainerSelectable = styled(Container)<{ isDisabled?: boolean; isSelected?: boolean; isHighlighted?: boolean }>`
  ${({ isHighlighted }) => isHighlighted && focusListItemOutlineStyle};

  &:focus-visible {
    ${focusListItemOutlineStyle};
  }

  &:active {
    ${Title} {
      color: ${props => props.theme.color.textSuccess};
    }
  }

  ${({ theme, isSelected }) =>
    isSelected &&
    css`
      ${Title} {
        color: ${theme.color.textDark};
      }
    `}

  ${({ theme, isDisabled }) =>
    !isDisabled &&
    css`
      &:hover {
        background-color: ${theme.color.backgroundDefaultHover};

        ${Title} {
          color: ${theme.color.textDark};
        }
      }
    `}

  ${({ theme, isDisabled }) =>
    isDisabled &&
    css`
      pointer-events: none;
      ${Title} {
        color: ${theme.color.textPlaceholder};
      }
      ${Badge} {
        background-color: ${theme.color.backgroundGraySubtle};
      }

      ${IconContainer} {
        svg path {
          fill: ${theme.color.iconSubtle};
        }
      }

      ${ChevronRightIcon} {
        path {
          fill: ${theme.color.iconSubtle};
        }
      }
    `}
`;

/** RED style container - for ListItemDelete and maybe more in the future */
const ContainerDelete = styled(Container)<{ isDisabled?: boolean; isSelected?: boolean; isHighlighted?: boolean }>`
  ${Title} {
    color: ${props => props.theme.color.textDanger};
    ${props => props.theme.typography.uiElementStrong};
  }

  ${LeftIconContainer} {
    svg path {
      fill: ${props => props.theme.color.iconDanger};
    }
  }

  ${({ isHighlighted, theme }) =>
    isHighlighted &&
    css`
      background-color: ${theme.color.backgroundDanger}0D;
      ${focusListItemOutlineStyle};
    `}

  ${({ theme, isDisabled }) =>
    !isDisabled &&
    css`
      &:hover {
        background-color: ${theme.color.backgroundDanger}0D;
      }
    `}


${({ theme, isDisabled }) =>
    isDisabled &&
    css`
      pointer-events: none;
      background-color: ${theme.color.backgroundGraySubtlest};

      ${Title} {
        color: ${theme.color.textPlaceholder};
      }
      ${LeftIconContainer} {
        svg path {
          fill: ${theme.color.iconSubtle};
        }
      }
    `}
`;

const HeaderTitle = styled.div`
  color: ${({ theme }) => theme.color.textDark};
  ${({ theme }) => theme.typography.h3};
  flex-grow: 1;
  cursor: default;
`;

export const ListItemStyles = {
  Container,
  ContainerSelectable,
  ContainerDelete,
  TextContainer,
  TitleContainer,
  DescriptionContainer,
  Title,
  Description,
  Badge,
  IconContainer,
  TickIcon,
  LeftIconContainer,
  RightIconContainer,
  TrailingIconContainer,
  ContentTypeIconContainer,
  ChevronRightIcon,
  HeaderTitle,
  ChevronLeftIcon,
};
