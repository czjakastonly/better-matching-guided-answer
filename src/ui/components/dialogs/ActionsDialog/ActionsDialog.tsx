import React, { useRef, useState } from 'react';

import { RowFlex } from '@ui/components/Flex';
import { ButtonPrimary } from '@ui/components/buttons/ButtonPrimary';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import type { ActionsDialogProps } from './ActionsDialog.types';
import { DialogHeader } from './components/DialogHeader';
import { DialogContentWrap } from './components/DialogContentWrap';
import { DialogFooterWrap } from './components/DialogFooterWrap';
import { DialogWrap } from './components/DialogWrap';
import { DialogContent } from './components/DialogContent';

import { DialogCloseButton } from './components/DialogCloseButton';
import Loader from '../_shared/Loader';
import { ContentWrapRefContext } from '../_shared/ContentWrapRefContext';

export const ActionsDialog = <T,>({
  autoFocusMode,
  children,
  className,
  closeAction,
  contentWrapMode = 'standard',
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
  showHeaderDivider,
  size,
  tertiaryRender,
  title,
  titleIcon,
  customSize,
  ...restDivAttributes
}: ActionsDialogProps<T>) => {
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const [dialogState, setDialogState] = useState(initialState);

  const domId = useDomId(id);
  const titleId = generateLabelDomId(domId, !!title);
  const contentId = generateDescribeDomId(domId, typeof children === 'string'); // mark as description only for primitive content

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

  /*
    CLOSE action (button) stuff
  */
  const shouldShowClose = typeof closeAction === 'function';

  return (
    <DialogWrap
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      {...restDivAttributes}
      className={mergeClassNames(STATIC_CLASS_NAME.dialog, className)}
      id={domId}
      size={size}
      customSize={customSize}
    >
      <ContentWrapRefContext.Provider value={contentWrapRef}>
        <DialogHeader iconLeft={titleIcon} titleId={titleId} showBottomDivider={showHeaderDivider}>
          {title}
        </DialogHeader>
        <DialogContentWrap
          id={contentId}
          className={STATIC_CLASS_NAME.dialogContent}
          data-ston-role="dialog-content"
          isLoading={isLoading}
        >
          {isLoading ? (
            <RowFlex alignItems="center" justifyContent="center" paddingTop={3} paddingBottom={2}>
              <Loader />
            </RowFlex>
          ) : (
            <DialogContent isNoPadding={contentWrapMode === 'nopadding'} ref={contentWrapRef}>
              {children}
            </DialogContent>
          )}
        </DialogContentWrap>
        <DialogFooterWrap>
          {shouldShowTertiary && tertiaryRender(setDialogState, dialogState)}
          <RowFlex gap={2} marginLeft="auto" flexShrink={0}>
            {shouldShowSecondary && (
              <SecondaryActionButton
                onClick={handleSecondaryClick}
                disabled={isSecondaryActionDisabled}
                autoFocus={autoFocusMode === 'secondary'}
                data-action="secondary"
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
              >
                {primaryLabel}
              </PrimaryActionButton>
            )}
          </RowFlex>
        </DialogFooterWrap>
        {shouldShowClose && (
          <DialogCloseButton
            autoFocus={autoFocusMode === 'close'}
            onClick={closeAction}
            aria-label="close"
            data-action="close"
          />
        )}
      </ContentWrapRefContext.Provider>
    </DialogWrap>
  );
};

ActionsDialog.displayName = 'ActionsDialog';
