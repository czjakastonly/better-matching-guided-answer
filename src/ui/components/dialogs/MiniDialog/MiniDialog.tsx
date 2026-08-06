import React, { useRef, useState } from 'react';

import { RowFlex } from '@ui/components/Flex';
import { ButtonPrimary } from '@ui/components/buttons/ButtonPrimary';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import type { MiniDialogProps } from './MiniDialog.types';
import { DialogHeader } from './components/DialogHeader';
import { DialogContentWrap } from './components/DialogContentWrap';
import { DialogFooterWrap } from './components/DialogFooterWrap';
import { DialogWrap } from './components/DialogWrap';
import { DialogContentContainer } from './components/DialogContentContainer';

import Loader from '../_shared/Loader';
import { ContentWrapRefContext } from '../_shared/ContentWrapRefContext';

/**
 * MiniDialog component to be displayed mainly in dropdowns (but not only).
 * It should be adjusted in terms of styling and props once DESIGN-SYSTEM includes it
 */
export const MiniDialog = <T,>({
  autoFocusMode,
  children,
  className,
  backAction,
  id,
  initialState,
  isLoading,
  primaryAction,
  primaryButtonComponent = ButtonPrimary,
  primaryIsDisabled = false,
  primaryIsLoading = false,
  primaryLabel = '____',
  secondaryAction,
  secondaryButtonComponent = ButtonMinimal,
  secondaryIsDisabled = false,
  secondaryLabel,
  showHeaderDivider = true,
  tertiaryRender,
  title,
  ...restDivAttributes
}: MiniDialogProps<T>) => {
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const [dialogState, setDialogState] = useState(initialState);

  const domId = useDomId(id);
  const titleId = generateLabelDomId(domId, !!title);
  const contentId = generateDescribeDomId(domId, typeof children === 'string'); // mark as description only for primitive content

  /*
    BACK action (button) stuff
  */
  const shouldShowBack = typeof backAction === 'function';

  /*
    PRIMARY action (button) stuff
  */

  const shouldShowPrimary = typeof primaryAction === 'function';
  const PrimaryActionButton = primaryButtonComponent;

  let isPrimaryActionDisabled;
  let handlePrimaryClick;
  if (shouldShowPrimary) {
    isPrimaryActionDisabled =
      typeof primaryIsDisabled === 'function' ? !!primaryIsDisabled(dialogState) : primaryIsDisabled;
    handlePrimaryClick = () => primaryAction(setDialogState, dialogState);
  }

  /*
    SECONDARY action (button) stuff
  */

  const shouldShowSecondary = typeof secondaryAction === 'function';
  const SecondaryActionButton = secondaryButtonComponent;

  let isSecondaryActionDisabled;
  let handleSecondaryClick;
  if (shouldShowSecondary) {
    isSecondaryActionDisabled =
      typeof secondaryIsDisabled === 'function' ? !!secondaryIsDisabled(dialogState) : secondaryIsDisabled;
    handleSecondaryClick = () => secondaryAction(setDialogState, dialogState);
  }

  /*
    TERTIARY action (not necessarily button) stuff
  */
  const shouldShowTertiary = typeof tertiaryRender === 'function';

  const shouldShowFooter = shouldShowSecondary || shouldShowPrimary || shouldShowTertiary;

  const shouldShowHeader = shouldShowBack || title;

  return (
    <DialogWrap
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      {...restDivAttributes}
      className={mergeClassNames(STATIC_CLASS_NAME.dialog, className)}
      id={domId}
    >
      <ContentWrapRefContext.Provider value={contentWrapRef}>
        {shouldShowHeader && (
          <DialogHeader
            onBackClick={shouldShowBack ? backAction : undefined}
            titleId={titleId}
            showBottomDivider={showHeaderDivider}
          >
            {title}
          </DialogHeader>
        )}
        <DialogContentWrap
          id={contentId}
          className={STATIC_CLASS_NAME.dialogContent}
          data-ston-role="dialog-content"
          isLoading={isLoading}
        >
          {isLoading ? (
            <RowFlex alignItems="center" justifyContent="center">
              <Loader />
            </RowFlex>
          ) : (
            <DialogContentContainer ref={contentWrapRef}>{children}</DialogContentContainer>
          )}
        </DialogContentWrap>
        {shouldShowFooter && (
          <DialogFooterWrap>
            {shouldShowTertiary && tertiaryRender(setDialogState, dialogState)}
            <RowFlex gap={2} marginLeft="auto" flexShrink={0}>
              {shouldShowSecondary && (
                <SecondaryActionButton
                  onClick={handleSecondaryClick}
                  disabled={isSecondaryActionDisabled}
                  autoFocus={autoFocusMode === 'secondary'}
                  data-action="secondary"
                  size="small"
                >
                  {secondaryLabel}
                </SecondaryActionButton>
              )}
              {shouldShowPrimary && (
                <PrimaryActionButton
                  onClick={handlePrimaryClick}
                  disabled={isPrimaryActionDisabled}
                  isLoading={primaryIsLoading}
                  autoFocus={autoFocusMode === 'primary'}
                  data-action="primary"
                  size="small"
                >
                  {primaryLabel}
                </PrimaryActionButton>
              )}
            </RowFlex>
          </DialogFooterWrap>
        )}
      </ContentWrapRefContext.Provider>
    </DialogWrap>
  );
};

MiniDialog.displayName = 'MiniDialog';
