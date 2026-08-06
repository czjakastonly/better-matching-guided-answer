import React, { useState } from 'react';
import { RowFlex } from '@ui/components/Flex';
import { ButtonPrimary } from '@ui/components/buttons/ButtonPrimary';
import { ButtonOutline } from '@ui/components/buttons/ButtonOutline';
import { generateDescribeDomId, generateLabelDomId, useDomId } from '@ui/utils/domId';
import { STATIC_CLASS_NAME } from '@ui/constants';
import { mergeClassNames } from '@ui/utils/mergeClassNames';
import type { WarningDialogProps } from './WarningDialog.types';
import { DialogHeader } from './components/DialogHeader';
import { DialogContentWrap } from './components/DialogContentWrap';
import { DialogFooterWrap } from './components/DialogFooterWrap';
import { DialogWrap } from './components/DialogWrap';
import { DialogContent } from './components/DialogContent';
import { DialogCloseButton } from './components/DialogCloseButton';
import Loader from '../_shared/Loader';

export const WarningDialog = <T,>({
  autoFocusMode,
  children,
  className,
  closeAction,
  id,
  initialState,
  isLoading,
  primaryAction,
  primaryButtonComponent = ButtonPrimary,
  primaryIsDisabled = false,
  primaryIsLoading = false,
  primaryLabel = '____',
  secondaryAction,
  secondaryButtonComponent = ButtonOutline,
  secondaryIsDisabled = false,
  secondaryLabel,
  severity,
  size = 'small',
  tertiaryRender,
  title,
  titleIcon,
  ...restDivAttributes
}: WarningDialogProps<T>) => {
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
    >
      <DialogHeader severity={severity} icon={titleIcon} titleId={titleId}>
        {title}
      </DialogHeader>
      <DialogContentWrap
        data-cy="dialogContentWrap"
        id={contentId}
        className={STATIC_CLASS_NAME.dialogContent}
        isLoading={isLoading}
      >
        {isLoading ? (
          <RowFlex alignItems="center" justifyContent="center" paddingTop={4} paddingBottom={1}>
            <Loader />
          </RowFlex>
        ) : (
          <DialogContent>{children}</DialogContent>
        )}
      </DialogContentWrap>
      <DialogFooterWrap>
        {shouldShowTertiary && tertiaryRender(setDialogState, dialogState)}
        <RowFlex gap={2} marginLeft="auto" marginRight="auto">
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
    </DialogWrap>
  );
};

WarningDialog.displayName = 'WarningDialog';
