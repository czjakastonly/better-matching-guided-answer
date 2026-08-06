import React from 'react';

import ChevronRightSVG from '@ui/atoms/icons/ChevronRight-16.svg';
import ChevronLeftSVG from '@ui/atoms/icons/ChevronLeft-16.svg';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import { CalendarStyles } from './styles';

export interface HeaderTranslations {
  calendarNavigationLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
}

export const Header = ({
  children,
  onPrevClick,
  onNextClick,
  onTextClick,
  calendarNavigationLabel = 'Calendar navigation',
  previousLabel = 'Previous',
  nextLabel = 'Next',
}: {
  children: React.ReactNode;
  onPrevClick: () => void;
  onNextClick: () => void;
  onTextClick?: () => void;
} & HeaderTranslations) => {
  return (
    <CalendarStyles.HeaderWrapper role="group" aria-label={calendarNavigationLabel}>
      <ButtonMinimal size="small" iconOnly={<ChevronLeftSVG />} onClick={onPrevClick} aria-label={previousLabel} />
      {typeof onTextClick === 'function' ? (
        <ButtonMinimal onClick={onTextClick} aria-label={nextLabel}>
          {children}
        </ButtonMinimal>
      ) : (
        <CalendarStyles.HeaderText aria-live="polite" aria-atomic="true">
          {children}
        </CalendarStyles.HeaderText>
      )}
      <ButtonMinimal size="small" iconOnly={<ChevronRightSVG />} onClick={onNextClick} aria-label={nextLabel} />
    </CalendarStyles.HeaderWrapper>
  );
};
